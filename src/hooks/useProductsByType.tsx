
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { Product } from '@/types/product';

// Produtos de fallback apenas para emergência real
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    name: 'Rolex Submariner Clone',
    brand: 'Rolex',
    category: 'Luxury',
    clone_category: 'Rolex',
    price: 299.99,
    original_price: 399.99,
    images: ['/placeholder.svg'],
    colors: ['Preto', 'Prata'],
    sizes: ['42mm'],
    is_new: true,
    is_featured: true,
    is_bestseller: false,
    is_sold_out: false,
    is_coming_soon: false,
    custom_badge: 'MAIS VENDIDO',
    in_stock: true,
    stock_status: 'in_stock',
    created_at: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    name: 'Omega Speedmaster Clone',
    brand: 'Omega',
    category: 'Sport',
    clone_category: 'Omega',
    price: 249.99,
    original_price: 349.99,
    images: ['/placeholder.svg'],
    colors: ['Preto'],
    sizes: ['40mm'],
    is_new: false,
    is_featured: true,
    is_bestseller: true,
    is_sold_out: false,
    is_coming_soon: false,
    in_stock: true,
    stock_status: 'in_stock',
    created_at: new Date().toISOString(),
  },
];

export const useProductsByType = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 2;
  const RETRY_DELAY = 1000; // Reduzido para 1s
  const QUERY_TIMEOUT = 30000; // Aumentado para 30s

  useEffect(() => {
    fetchProductsByType();
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchProductsByType = async (isRetry = false) => {
    try {
      setLoading(true);
      
      console.log('🚀 Iniciando busca de produtos...');

      // Query SIMPLIFICADA - apenas campos essenciais
      const queryTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout após 30s')), QUERY_TIMEOUT)
      );

      const queryPromise = supabase
        .from('products')
        .select(`
          id,
          name,
          brand,
          price,
          original_price,
          images,
          is_new,
          is_featured,
          clone_category
        `)
        .limit(50); // Limitar resultados para acelerar

      const { data: allProducts, error } = await Promise.race([
        queryPromise,
        queryTimeout
      ]) as any;

      if (error) {
        console.error('❌ Erro na query:', error);
        throw error;
      }

      console.log('✅ Produtos carregados:', allProducts?.length || 0);

      // Se não há produtos, usar fallback
      if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ Nenhum produto encontrado - usando fallback');
        
        const novos = FALLBACK_PRODUCTS.filter(p => p.is_new);
        const destaques = FALLBACK_PRODUCTS.filter(p => p.is_featured);
        const ofertas = FALLBACK_PRODUCTS.filter(p => p.original_price && p.original_price > p.price);

        setNewProducts(novos);
        setFeaturedProducts(destaques);
        setOfferProducts(ofertas);
        setLoading(false);
        return;
      }

      // Filtros simples e diretos
      const novos = allProducts.filter(p => p.is_new === true);
      const destaques = allProducts.filter(p => p.is_featured === true);
      const ofertas = allProducts.filter(p => {
        const price = Number(p.price) || 0;
        const originalPrice = Number(p.original_price) || 0;
        return originalPrice > 0 && originalPrice > price;
      });

      console.log('✨ Resultados:', {
        total: allProducts.length,
        novos: novos.length,
        destaques: destaques.length,
        ofertas: ofertas.length
      });

      // Definir produtos (limitando quantidade)
      setNewProducts(novos.slice(0, 8));
      setFeaturedProducts(destaques.slice(0, 8));
      setOfferProducts(ofertas.slice(0, 8));

      setRetryCount(0);

    } catch (error: any) {
      console.error('💥 Erro:', error?.message);

      // Retry automático apenas se necessário
      if (retryCount < MAX_RETRIES && !isRetry) {
        setRetryCount(prev => prev + 1);
        console.log(`🔄 Tentativa ${retryCount + 2}/${MAX_RETRIES + 1}...`);
        
        await sleep(RETRY_DELAY);
        return fetchProductsByType(true);
      }

      // Fallback após esgotar tentativas
      console.warn('🆘 Usando produtos demo após falha');
      
      const novos = FALLBACK_PRODUCTS.filter(p => p.is_new);
      const destaques = FALLBACK_PRODUCTS.filter(p => p.is_featured);
      const ofertas = FALLBACK_PRODUCTS.filter(p => p.original_price && p.original_price > p.price);

      setNewProducts(novos);
      setFeaturedProducts(destaques);
      setOfferProducts(ofertas);

      secureLog.error('Erro ao buscar produtos por tipo', error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    console.log('🔄 Refetch manual');
    setRetryCount(0);
    fetchProductsByType();
  };

  return {
    newProducts,
    featuredProducts,
    offerProducts,
    loading,
    refetch,
    debugInfo
  };
};
