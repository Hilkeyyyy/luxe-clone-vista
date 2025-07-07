
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { Product } from '@/types/product';

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
      setDebugInfo('🔍 Carregando produtos...');
      console.log('🚀 INICIANDO BUSCA DE PRODUTOS');

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
          is_coming_soon,
          custom_badge,
          in_stock,
          stock_status,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        setDebugInfo(`❌ Erro: ${error.message}`);
        console.error('Erro ao carregar produtos:', error);
        throw error;
      }

      if (!allProducts || allProducts.length === 0) {
        setDebugInfo('⚠️ Nenhum produto encontrado');
        setNewProducts([]);
        setFeaturedProducts([]);
        setOfferProducts([]);
        setLoading(false);
        return;
      }

      // Filtrar produtos
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

      setDebugInfo(`✅ ${allProducts.length} produtos: ${novos.length} novos, ${destaques.length} destaques, ${ofertas.length} ofertas`);

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
