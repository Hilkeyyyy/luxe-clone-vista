
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { Product } from '@/types/product';

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
      setLoading(true);
      
      console.log('🚀 Iniciando busca de produtos...');

      // Query DIRETA e SIMPLES - sem timeout artificial
      const { data: allProducts, error } = await supabase
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
        .limit(30);

      if (error) {
        console.error('❌ Erro na query de produtos:', error);
        throw error;
      }

      console.log('✅ Produtos recebidos:', allProducts?.length || 0);

      if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ Nenhum produto encontrado no banco');
        setNewProducts([]);
        setFeaturedProducts([]);
        setOfferProducts([]);
        return;
      }

      // Filtros SIMPLES - garantindo tipos corretos
      const novos = allProducts.filter(p => Boolean(p.is_new));
      const destaques = allProducts.filter(p => Boolean(p.is_featured));
      
      // Lógica de ofertas corrigida - conversão de tipos
      const ofertas = allProducts.filter(p => {
        const price = parseFloat(String(p.price)) || 0;
        const originalPrice = parseFloat(String(p.original_price)) || 0;
        return originalPrice > 0 && originalPrice > price;
      });

      console.log('📊 Produtos filtrados:', {
        total: allProducts.length,
        novos: novos.length,
        destaques: destaques.length,
        ofertas: ofertas.length
      });

      // Setar produtos diretamente - sem slice desnecessário
      setNewProducts(novos);
      setFeaturedProducts(destaques);
      setOfferProducts(ofertas);

    } catch (error: any) {
      console.error('💥 Erro crítico ao buscar produtos:', error);
      secureLog.error('Erro crítico useProductsByType', error);
      
      // Arrays vazios em caso de erro
      setNewProducts([]);
      setFeaturedProducts([]);
      setOfferProducts([]);
    } finally {
      console.log('🏁 Finalizando loading...');
      setLoading(false);
    }
  };

  const refetch = () => {
    console.log('🔄 Refetch solicitado');
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
