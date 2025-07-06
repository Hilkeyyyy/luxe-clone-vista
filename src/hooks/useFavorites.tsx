
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
}

export const useFavorites = () => {
  const { toast } = useToast();
  const [favorites] = useLocalStorage<string[]>('favorites', []);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', favorites);

      if (error) throw error;
      setFavoriteProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar seus produtos favoritos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [favorites]);

  return {
    favoriteProducts,
    loading,
    refetch: loadFavorites,
  };
};
