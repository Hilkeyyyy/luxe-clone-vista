
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  clone_category: string;
  stock_status: string;
  is_sold_out: boolean;
  custom_badge?: string;
  is_bestseller: boolean;
  is_featured: boolean;
  is_new: boolean;
  category: string;
  created_at: string;
}

export const useProductsFilter = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCloneCategory, setSelectedCloneCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // CORREÇÃO CRÍTICA: Filtro exato por marca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        // Primeiro tenta match exato da marca
        const exactBrandMatch = product.brand.toLowerCase() === searchLower;
        if (exactBrandMatch) return true;
        
        // Se não encontrou match exato da marca, busca no nome do produto
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        
        // Retorna apenas se não houver produtos com match exato de marca
        const hasExactBrandProducts = products.some(p => 
          p.brand.toLowerCase() === searchLower
        );
        
        return !hasExactBrandProducts && nameMatch;
      });
    }

    // Filtro por marca/categoria - EXATO
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtro por tipo de relógio (ETA Base, Clone, Super Clone)
    if (selectedCloneCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.clone_category === selectedCloneCategory
      );
    }

    // Filtro por faixa de preço
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (priceRange) {
          case 'under-500':
            return price < 500;
          case '500-1000':
            return price >= 500 && price <= 1000;
          case '1000-2000':
            return price >= 1000 && price <= 2000;
          case 'over-2000':
            return price > 2000;
          default:
            return true;
        }
      });
    }

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedCloneCategory, priceRange, sortBy]);

  // Extrair categorias únicas dos produtos
  const categories = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(product => {
      if (product.brand) brandSet.add(product.brand);
    });
    return Array.from(brandSet).sort();
  }, [products]);

  const cloneCategories = useMemo(() => 
    [...new Set(products.map(p => p.clone_category))].filter(Boolean), 
    [products]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCloneCategory('all');
    setPriceRange('all');
    setSortBy('newest');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products: filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedCloneCategory,
    setSelectedCloneCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    categories,
    cloneCategories,
    clearFilters,
    refetch: fetchProducts,
  };
};
