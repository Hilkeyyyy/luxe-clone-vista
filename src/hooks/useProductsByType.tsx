
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  clone_category?: string;
  price: number;
  original_price?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  is_new?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_sold_out?: boolean;
  stock_status: string;
  created_at: string;
}

export const useProductsByType = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('🔄 Iniciando...');

  useEffect(() => {
    fetchProductsByType();
  }, []);

  const fetchProductsByType = async () => {
    try {
      setLoading(true);
      setDebugInfo('🔍 Conectando com Supabase...');

      console.log('🚀 MOBILE DEBUG: Iniciando busca de produtos...');

      if (!supabase) {
        const errorMsg = '❌ Supabase client não encontrado';
        setDebugInfo(errorMsg);
        console.error('ERRO CRÍTICO:', errorMsg);
        return;
      }

      setDebugInfo('📡 Executando query...');

      // Query otimizada com campos específicos
      const { data: allProducts, error } = await supabase
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
          stock_status,
          created_at
        `)
        .order('created_at', { ascending: false });

      console.log('📊 RESPOSTA SUPABASE:', {
        produtos_encontrados: allProducts?.length || 0,
        erro: error?.message || 'nenhum',
        primeiro_produto: allProducts?.[0]?.name || 'nenhum'
      });

      if (error) {
        const errorMsg = `❌ Erro na query: ${error.message}`;
        setDebugInfo(errorMsg);
        console.error('ERRO SUPABASE:', error);
        throw error;
      }

      if (!allProducts || allProducts.length === 0) {
        setDebugInfo('⚠️ Nenhum produto encontrado no banco');
        console.log('AVISO: Banco de dados vazio ou sem produtos');
        setNewProducts([]);
        setFeaturedProducts([]);
        setOfferProducts([]);
        setLoading(false);
        return;
      }

      console.log('✅ PRODUTOS CARREGADOS:', allProducts.length);
      setDebugInfo(`✅ ${allProducts.length} produtos carregados`);

      // Filtrar PRODUTOS NOVOS
      const novos = allProducts.filter(p => p.is_new === true);
      console.log('🆕 PRODUTOS NOVOS:', {
        quantidade: novos.length,
        nomes: novos.slice(0, 3).map(p => p.name)
      });
      setNewProducts(novos.slice(0, 8));

      // Filtrar PRODUTOS EM DESTAQUE  
      const destaques = allProducts.filter(p => p.is_featured === true);
      console.log('⭐ PRODUTOS DESTAQUE:', {
        quantidade: destaques.length,
        nomes: destaques.slice(0, 3).map(p => p.name)
      });
      setFeaturedProducts(destaques);

      // Filtrar PRODUTOS EM OFERTA
      const ofertas = allProducts.filter(p => 
        p.original_price && 
        p.original_price > 0 && 
        p.original_price > p.price
      );
      console.log('🏷️ PRODUTOS OFERTA:', {
        quantidade: ofertas.length,
        nomes: ofertas.slice(0, 3).map(p => p.name)
      });
      setOfferProducts(ofertas.slice(0, 8));

      const finalMsg = `🎉 Sucesso: ${novos.length} novos, ${destaques.length} destaques, ${ofertas.length} ofertas`;
      setDebugInfo(finalMsg);

      console.log('🏁 RESULTADO FINAL:', {
        novos: novos.length,
        destaques: destaques.length,
        ofertas: ofertas.length,
        loading: false,
        status: 'CONCLUÍDO'
      });

    } catch (error: any) {
      const errorMsg = `💥 Erro crítico: ${error?.message || 'Desconhecido'}`;
      setDebugInfo(errorMsg);
      console.error('ERRO CRÍTICO COMPLETO:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      secureLog.error('Erro crítico ao buscar produtos por tipo', error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    console.log('🔄 REFETCH solicitado');
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
