
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  is_new: boolean;
  is_featured: boolean;
  clone_category?: string;
  stock_status: string;
  created_at: string;
}

export const useProductsByType = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsByType();
  }, []);

  const fetchProductsByType = async () => {
    try {
      // Buscar produtos novidades (is_new = true)
      const { data: newData, error: newError } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (newError) throw newError;
      setNewProducts(newData || []);

      // Buscar produtos em destaque (is_featured = true)
      const { data: featuredData, error: featuredError } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (featuredError) throw featuredError;
      setFeaturedProducts(featuredData || []);

      // Buscar produtos em oferta (que têm original_price > price)
      const { data: offerData, error: offerError } = await supabase
        .from('products')
        .select('*')
        .not('original_price', 'is', null)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (offerError) throw offerError;
      
      // Filtrar apenas produtos que realmente estão em oferta
      const filteredOffers = offerData?.filter(product => 
        product.original_price && product.original_price > product.price
      ) || [];
      
      setOfferProducts(filteredOffers);

    } catch (error) {
      console.error('Erro ao buscar produtos por tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setLoading(true);
    fetchProductsByType();
  };

  return {
    newProducts,
    featuredProducts,
    offerProducts,
    loading,
    refetch
  };
};
