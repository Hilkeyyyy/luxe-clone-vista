
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
  const [debugInfo, setDebugInfo] = useState<string>('🔄 Iniciando...');
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;
  const QUERY_TIMEOUT = 15000; // Aumentar timeout

  useEffect(() => {
    fetchProductsByType();
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchProductsByType = async (isRetry = false) => {
    try {
      setLoading(true);
      
      const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('preview');
      
      setDebugInfo(`🌍 Buscando produtos...`);
      
      console.log('🚀 INICIANDO BUSCA:', {
        ambiente: isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO',
        tentativa: retryCount + 1,
        isRetry
      });

      // Query com timeout
      const queryTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na consulta')), QUERY_TIMEOUT)
      );

      const queryPromise = supabase
        .from('products')
        .select(`
          id,
          name,
          brand,
          category,
          clone_category,
          price,
          original_price,
          images,
          colors,
          sizes,
          is_new,
          is_featured,
          is_bestseller,
          is_sold_out,
          is_coming_soon,
          custom_badge,
          in_stock,
          stock_status,
          created_at
        `)
        .order('created_at', { ascending: false });

      const { data: allProducts, error } = await Promise.race([
        queryPromise,
        queryTimeout
      ]) as any;

      if (error) {
        console.error('❌ ERRO NA QUERY:', error);
        throw error;
      }

      console.log('📊 DADOS BRUTOS DO BANCO:', {
        totalProdutos: allProducts?.length || 0,
        primeiros3: allProducts?.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          is_new: p.is_new,
          is_featured: p.is_featured,
          price: p.price,
          original_price: p.original_price,
          tipos: typeof p.is_new + '/' + typeof p.is_featured + '/' + typeof p.price
        })) || []
      });

      // Se não há produtos, usar fallback
      if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ NENHUM PRODUTO ENCONTRADO - USANDO FALLBACK');
        setDebugInfo('⚠️ Banco vazio - usando produtos demo');
        
        const novos = FALLBACK_PRODUCTS.filter(p => p.is_new);
        const destaques = FALLBACK_PRODUCTS.filter(p => p.is_featured);
        const ofertas = FALLBACK_PRODUCTS.filter(p => p.original_price && p.original_price > p.price);

        setNewProducts(novos);
        setFeaturedProducts(destaques);
        setOfferProducts(ofertas);
        setLoading(false);
        return;
      }

      // FILTROS CORRIGIDOS - Tratar valores do Supabase
      const novos = allProducts.filter(p => p.is_new === true);
      const destaques = allProducts.filter(p => p.is_featured === true);
      const ofertas = allProducts.filter(p => {
        const price = Number(p.price) || 0;
        const originalPrice = Number(p.original_price) || 0;
        return originalPrice > 0 && originalPrice > price;
      });

      console.log('✨ FILTROS APLICADOS:', {
        novos: novos.length,
        destaques: destaques.length,
        ofertas: ofertas.length,
        detalhes: {
          novos: novos.map(p => p.name),
          destaques: destaques.map(p => p.name),
          ofertas: ofertas.map(p => `${p.name} (${p.price} < ${p.original_price})`)
        }
      });

      // Definir produtos (limitando quantidade)
      setNewProducts(novos.slice(0, 8));
      setFeaturedProducts(destaques.slice(0, 8));
      setOfferProducts(ofertas.slice(0, 8));

      setDebugInfo(`✅ ${allProducts.length} produtos • N:${novos.length} D:${destaques.length} O:${ofertas.length}`);
      setRetryCount(0);

      console.log('✅ SUCESSO FINAL:', {
        totalProdutos: allProducts.length,
        novos: novos.length,
        destaques: destaques.length,
        ofertas: ofertas.length,
        ambiente: isProduction ? 'PRODUÇÃO' : 'DEV'
      });

    } catch (error: any) {
      console.error('💥 ERRO CRÍTICO:', {
        message: error?.message,
        tentativa: retryCount + 1,
        maxTentativas: MAX_RETRIES
      });

      // Retry automático
      if (retryCount < MAX_RETRIES && !isRetry) {
        setRetryCount(prev => prev + 1);
        setDebugInfo(`🔄 Tentativa ${retryCount + 2}/${MAX_RETRIES + 1}...`);
        
        await sleep(RETRY_DELAY);
        return fetchProductsByType(true);
      }

      // Fallback apenas após esgotar tentativas
      console.warn('🆘 FALLBACK APÓS TODAS AS TENTATIVAS FALHAREM');
      setDebugInfo('🆘 Erro na conexão - produtos demo');
      
      const novos = FALLBACK_PRODUCTS.filter(p => p.is_new);
      const destaques = FALLBACK_PRODUCTS.filter(p => p.is_featured);
      const ofertas = FALLBACK_PRODUCTS.filter(p => p.original_price && p.original_price > p.price);

      setNewProducts(novos);
      setFeaturedProducts(destaques);
      setOfferProducts(ofertas);

      secureLog.error('Erro crítico ao buscar produtos por tipo', error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    console.log('🔄 REFETCH MANUAL');
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
