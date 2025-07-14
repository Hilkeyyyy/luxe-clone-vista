
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCloneCategory, setSelectedCloneCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Inicializar filtro da URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get('selectedCategory');
    if (categoryFromUrl && categoryFromUrl !== 'all') {
      console.log('🔍 Aplicando filtro da URL:', categoryFromUrl);
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('📦 Buscando produtos...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        throw error;
      }
      
      console.log('✅ Produtos carregados:', data?.length || 0);
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
    console.log('🔄 Iniciando filtragem com', filtered.length, 'produtos');

    // FILTRO POR MARCA EXATO - CORREÇÃO CRÍTICA
    if (selectedCategory !== 'all') {
      console.log('🏷️ Filtrando por marca:', selectedCategory);
      filtered = filtered.filter(product => {
        const productBrand = product.brand.toLowerCase().trim();
        const filterBrand = selectedCategory.toLowerCase().trim();
        const brandMatch = productBrand === filterBrand;
        console.log(`Produto: ${product.name} | Marca do produto: "${productBrand}" | Filtro: "${filterBrand}" | Match: ${brandMatch}`);
        return brandMatch;
      });
      console.log('✅ Produtos após filtro de marca:', filtered.length);
    }

    // Filtro por busca - só aplica se não há categoria selecionada
    if (searchTerm.trim() && selectedCategory === 'all') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      );
      console.log('🔍 Produtos após busca:', filtered.length);
    }

    // Filtro por tipo de relógio
    if (selectedCloneCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.clone_category === selectedCloneCategory
      );
      console.log('⌚ Produtos após filtro de categoria:', filtered.length);
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
      console.log('💰 Produtos após filtro de preço:', filtered.length);
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

    console.log('🎯 Produtos finais após todos os filtros:', filtered.length);
    return filtered;
  }, [products, searchTerm, selectedCategory, selectedCloneCategory, priceRange, sortBy]);

  const categories = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(product => {
      if (product.brand) brandSet.add(product.brand);
    });
    const brands = Array.from(brandSet).sort();
    console.log('🏷️ Marcas disponíveis:', brands);
    return brands;
  }, [products]);

  const cloneCategories = useMemo(() => 
    [...new Set(products.map(p => p.clone_category))].filter(Boolean), 
    [products]
  );

  const clearFilters = () => {
    console.log('🧹 Limpando todos os filtros');
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCloneCategory('all');
    setPriceRange('all');
    setSortBy('newest');
    setSearchParams({});
  };

  // Atualizar URL quando categoria muda
  const handleCategoryChange = (category: string) => {
    console.log('🔄 Mudando categoria para:', category);
    setSelectedCategory(category);
    if (category !== 'all') {
      setSearchParams({ selectedCategory: category });
    } else {
      setSearchParams({});
    }
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
    setSelectedCategory: handleCategoryChange,
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
