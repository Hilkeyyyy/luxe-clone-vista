
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';

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
  const [debugInfo, setDebugInfo] = useState<string>('Iniciando...');

  useEffect(() => {
    fetchProductsByType();
  }, []);

  const fetchProductsByType = async () => {
    try {
      setLoading(true);
      setDebugInfo('🔍 Conectando com banco...');

      // TESTE 1: Verificar se Supabase funciona
      console.log('DEBUG MOBILE: Testando Supabase...');
      
      if (!supabase) {
        setDebugInfo('❌ Supabase não conectado');
        console.error('ERRO: Supabase client não existe');
        return;
      }

      setDebugInfo('📡 Buscando produtos...');

      // TESTE 2: Buscar TODOS os produtos
      const { data: allProducts, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('DEBUG MOBILE - Resposta do banco:', {
        produtos: allProducts?.length || 0,
        erro: error?.message,
        dados: allProducts?.slice(0, 2) // Primeiros 2 produtos
      });

      if (error) {
        setDebugInfo(`❌ Erro do banco: ${error.message}`);
        console.error('ERRO SUPABASE:', error);
        throw error;
      }

      if (!allProducts || allProducts.length === 0) {
        setDebugInfo('⚠️ Nenhum produto no banco');
        console.log('AVISO: Banco vazio');
        setNewProducts([]);
        setFeaturedProducts([]);
        setOfferProducts([]);
        setLoading(false);
        return;
      }

      setDebugInfo(`✅ ${allProducts.length} produtos encontrados`);

      // FILTRAR PRODUTOS NOVOS
      const novos = allProducts.filter(p => p.is_new === true);
      console.log('PRODUTOS NOVOS:', novos.length, novos.map(p => p.name));
      setNewProducts(novos.slice(0, 8));

      // FILTRAR PRODUTOS EM DESTAQUE  
      const destaques = allProducts.filter(p => p.is_featured === true);
      console.log('PRODUTOS DESTAQUE:', destaques.length, destaques.map(p => p.name));
      setFeaturedProducts(destaques);

      // FILTRAR PRODUTOS EM OFERTA
      const ofertas = allProducts.filter(p => 
        p.original_price && p.original_price > p.price
      );
      console.log('PRODUTOS OFERTA:', ofertas.length, ofertas.map(p => p.name));
      setOfferProducts(ofertas.slice(0, 8));

      setDebugInfo(`🎉 Carregado: ${novos.length} novos, ${destaques.length} destaques, ${ofertas.length} ofertas`);

      // LOG FINAL
      console.log('🎯 RESULTADO FINAL MOBILE:', {
        novos: novos.length,
        destaques: destaques.length, 
        ofertas: ofertas.length,
        primeiroProduto: allProducts[0]?.name,
        loading: false
      });

    } catch (error: any) {
      const errorMsg = `💥 Erro: ${error?.message || 'Desconhecido'}`;
      setDebugInfo(errorMsg);
      console.error('ERRO CRÍTICO MOBILE:', error);
      secureLog.error('Erro crítico ao buscar produtos por tipo', error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    console.log('🔄 REFETCH chamado');
    fetchProductsByType();
  };

  // LOG ESTADO ATUAL
  console.log('📊 ESTADO HOOK:', {
    loading,
    newCount: newProducts.length,
    featuredCount: featuredProducts.length,
    offerCount: offerProducts.length,
    debugInfo
  });

  return {
    newProducts,
    featuredProducts,
    offerProducts,
    loading,
    refetch,
    debugInfo // Para mostrar na tela se necessário
  };
};
