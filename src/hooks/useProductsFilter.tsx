
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

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedCloneCategory !== 'all') {
      filtered = filtered.filter(product => product.clone_category === selectedCloneCategory);
    }

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
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedCloneCategory, priceRange, sortBy]);

  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
  const cloneCategories = useMemo(() => [...new Set(products.map(p => p.clone_category))], [products]);

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
