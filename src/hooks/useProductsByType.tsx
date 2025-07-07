
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { Product } from '@/types/product';

export const useProductsByType = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductsByType = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('🚀 Buscando produtos...');

      // Query otimizada com timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const { data: allProducts, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          brand,
          category,
          price,
          original_price,
          images,
          is_new,
          is_featured,
          clone_category,
          colors,
          sizes,
          stock_status,
          created_at
        `)
        .limit(30)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error('❌ Erro na query:', error);
        throw error;
      }

      console.log('✅ Produtos recebidos:', allProducts?.length || 0);

      if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ Nenhum produto encontrado');
        setNewProducts([]);
        setFeaturedProducts([]);
        setOfferProducts([]);
        return;
      }

      // Mapear produtos
      const mappedProducts: Product[] = allProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        clone_category: p.clone_category || 'Clone',
        price: parseFloat(String(p.price)) || 0,
        original_price: p.original_price ? parseFloat(String(p.original_price)) : undefined,
        images: p.images || [],
        colors: p.colors || [],
        sizes: p.sizes || [],
        is_new: Boolean(p.is_new),
        is_featured: Boolean(p.is_featured),
        stock_status: p.stock_status || 'in_stock',
        created_at: p.created_at,
        is_bestseller: false,
        is_sold_out: false,
        is_coming_soon: false,
        in_stock: true
      }));

      // Filtrar produtos
      const novos = mappedProducts.filter(p => p.is_new);
      const destaques = mappedProducts.filter(p => p.is_featured);
      const ofertas = mappedProducts.filter(p => {
        return p.original_price && p.original_price > 0 && p.original_price > p.price;
      });

      console.log('📊 Produtos filtrados:', {
        total: mappedProducts.length,
        novos: novos.length,
        destaques: destaques.length,
        ofertas: ofertas.length
      });

      setNewProducts(novos);
      setFeaturedProducts(destaques);
      setOfferProducts(ofertas);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('⏰ Query cancelada por timeout');
      } else {
        console.error('💥 Erro ao buscar produtos:', error);
        secureLog.error('Erro useProductsByType', error);
      }
      
      // Fallback para arrays vazios
      setNewProducts([]);
      setFeaturedProducts([]);
      setOfferProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    console.log('🔄 Refetch produtos');
    fetchProductsByType();
  }, [fetchProductsByType]);

  useEffect(() => {
    fetchProductsByType();
  }, [fetchProductsByType]);

  return {
    newProducts,
    featuredProducts,
    offerProducts,
    loading,
    refetch
  };
};
