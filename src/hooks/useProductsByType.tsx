
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { Product } from '@/types/product';

export const useProductsByType = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const mounted = useRef(true);
  const initialized = useRef(false);

  const fetchProductsByType = useCallback(async () => {
    if (!mounted.current || initialized.current) return;
    
    try {
      setLoading(true);
      initialized.current = true;
      
      console.log('🚀 Buscando produtos...');

      // Query otimizada com timeout de 3s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn('⏰ Query cancelada por timeout (3s)');
      }, 3000);

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
        .limit(15) // Reduzido para carregamento mais rápido
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (!mounted.current) return;

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

      // Mapear produtos com fallbacks seguros
      const mappedProducts: Product[] = allProducts.map(p => ({
        id: p.id,
        name: p.name || 'Produto sem nome',
        brand: p.brand || 'Marca',
        category: p.category || 'Categoria',
        clone_category: p.clone_category || 'Clone',
        price: parseFloat(String(p.price)) || 0,
        original_price: p.original_price ? parseFloat(String(p.original_price)) : undefined,
        images: Array.isArray(p.images) ? p.images : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        is_new: Boolean(p.is_new),
        is_featured: Boolean(p.is_featured),
        stock_status: p.stock_status || 'in_stock',
        created_at: p.created_at,
        is_bestseller: false,
        is_sold_out: false,
        is_coming_soon: false,
        in_stock: true
      }));

      // Filtrar produtos de forma mais eficiente
      const novos = mappedProducts.filter(p => p.is_new).slice(0, 6);
      const destaques = mappedProducts.filter(p => p.is_featured).slice(0, 6);
      const ofertas = mappedProducts.filter(p => {
        return p.original_price && p.original_price > 0 && p.original_price > p.price;
      }).slice(0, 6);

      console.log('📊 Produtos filtrados:', {
        total: mappedProducts.length,
        novos: novos.length,
        destaques: destaques.length,
        ofertas: ofertas.length
      });

      if (mounted.current) {
        setNewProducts(novos);
        setFeaturedProducts(destaques);
        setOfferProducts(ofertas);
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('⏰ Query cancelada por timeout');
      } else {
        console.error('💥 Erro ao buscar produtos:', error);
        secureLog.error('Erro useProductsByType', error);
      }
      
      // Fallback para arrays vazios
      if (mounted.current) {
        setNewProducts([]);
        setFeaturedProducts([]);
        setOfferProducts([]);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const refetch = useCallback(() => {
    console.log('🔄 Refetch produtos');
    initialized.current = false;
    fetchProductsByType();
  }, [fetchProductsByType]);

  useEffect(() => {
    mounted.current = true;
    
    // Executar imediatamente sem delay
    fetchProductsByType();

    return () => {
      mounted.current = false;
    };
  }, [fetchProductsByType]);

  return {
    newProducts,
    featuredProducts,
    offerProducts,
    loading,
    refetch
  };
};
