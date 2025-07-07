
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
      
      console.log('🚀 Buscando produtos...');

      // Query SIMPLIFICADA - apenas campos essenciais, sem timeout artificial
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
        .limit(50);

      if (error) {
        console.error('❌ Erro na query:', error);
        throw error;
      }

      console.log('✅ Produtos carregados:', allProducts?.length || 0);

      if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ Nenhum produto encontrado');
        setNewProducts([]);
        setFeaturedProducts([]);
        setOfferProducts([]);
        setLoading(false);
        return;
      }

      // Filtros SIMPLES e DIRETOS - garantindo conversão de tipos
      const novos = allProducts.filter(p => p.is_new === true);
      const destaques = allProducts.filter(p => p.is_featured === true);
      
      // Correção na lógica de ofertas - garantindo conversão para number
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

      // Definir produtos limitando quantidade para performance
      setNewProducts(novos.slice(0, 8));
      setFeaturedProducts(destaques.slice(0, 8));
      setOfferProducts(ofertas.slice(0, 8));

    } catch (error: any) {
      console.error('💥 Erro ao buscar produtos:', error?.message);
      secureLog.error('Erro ao buscar produtos por tipo', error);
      
      // Em caso de erro, definir arrays vazios em vez de fallback
      setNewProducts([]);
      setFeaturedProducts([]);
      setOfferProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    console.log('🔄 Refetch manual');
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
