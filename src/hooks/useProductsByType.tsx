
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { Product } from '@/types/product';

// Produtos de fallback para emergência
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
  const RETRY_DELAY = 2000; // 2 segundos

  useEffect(() => {
    fetchProductsByType();
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchProductsByType = async (isRetry = false) => {
    try {
      setLoading(true);
      
      // Diagnóstico de ambiente
      const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('preview');
      const currentUrl = window.location.href;
      
      setDebugInfo(`🌍 Ambiente: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
      
      console.log('🚀 DIAGNÓSTICO COMPLETO:', {
        ambiente: isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO',
        url: currentUrl,
        hostname: window.location.hostname,
        tentativa: retryCount + 1,
        isRetry
      });

      // Timeout para a query
      const queryTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na consulta')), 10000)
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

      // Race entre query e timeout
      const { data: allProducts, error } = await Promise.race([
        queryPromise,
        queryTimeout
      ]) as any;

      if (error) {
        throw error;
      }

      console.log('📊 RESULTADO DA QUERY:', {
        totalProdutos: allProducts?.length || 0,
        primeiroProduto: allProducts?.[0]?.name || 'Nenhum',
        ambiente: isProduction ? 'PRODUÇÃO' : 'DEV'
      });

      if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ NENHUM PRODUTO ENCONTRADO - USANDO FALLBACK');
        setDebugInfo('⚠️ Usando produtos de demonstração');
        
        // Usar produtos de fallback
        const novos = FALLBACK_PRODUCTS.filter(p => p.is_new);
        const destaques = FALLBACK_PRODUCTS.filter(p => p.is_featured);
        const ofertas = FALLBACK_PRODUCTS.filter(p => p.original_price && p.original_price > p.price);

        setNewProducts(novos);
        setFeaturedProducts(destaques);
        setOfferProducts(ofertas);
        setLoading(false);
        return;
      }

      // Processar produtos normalmente
      const novos = allProducts.filter(p => p.is_new === true);
      const destaques = allProducts.filter(p => p.is_featured === true);
      const ofertas = allProducts.filter(p => 
        p.original_price && 
        p.original_price > 0 && 
        p.original_price > p.price
      );

      setNewProducts(novos.slice(0, 8));
      setFeaturedProducts(destaques);
      setOfferProducts(ofertas.slice(0, 8));

      setDebugInfo(`✅ ${allProducts.length} produtos carregados com sucesso`);
      setRetryCount(0); // Reset retry count on success

      console.log('✅ SUCESSO COMPLETO:', {
        novos: novos.length,
        destaques: destaques.length,
        ofertas: ofertas.length,
        ambiente: isProduction ? 'PRODUÇÃO' : 'DEV'
      });

    } catch (error: any) {
      const errorMsg = `💥 Erro: ${error?.message || 'Desconhecido'}`;
      console.error('💥 ERRO CRÍTICO:', {
        message: error?.message,
        name: error?.name,
        tentativa: retryCount + 1,
        maxTentativas: MAX_RETRIES,
        stack: error?.stack?.substring(0, 200)
      });

      // Implementar retry automático
      if (retryCount < MAX_RETRIES && !isRetry) {
        setRetryCount(prev => prev + 1);
        setDebugInfo(`🔄 Tentativa ${retryCount + 2}/${MAX_RETRIES + 1}...`);
        
        console.log(`🔄 RETRY ${retryCount + 1}/${MAX_RETRIES} em ${RETRY_DELAY}ms`);
        
        await sleep(RETRY_DELAY);
        return fetchProductsByType(true);
      }

      // Se todas as tentativas falharam, usar fallback
      console.warn('🆘 TODAS AS TENTATIVAS FALHARAM - USANDO FALLBACK DE EMERGÊNCIA');
      setDebugInfo('🆘 Erro na conexão - usando produtos de demonstração');
      
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
    console.log('🔄 REFETCH MANUAL solicitado');
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
