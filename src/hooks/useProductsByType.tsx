
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

  useEffect(() => {
    console.log('🚀 =================================');
    console.log('🚀 useProductsByType: INICIANDO DEBUG');
    console.log('🚀 =================================');
    fetchProductsByType();
  }, []);

  const fetchProductsByType = async () => {
    try {
      console.log('🔥 STEP 1: Iniciando fetchProductsByType...');
      setLoading(true);

      // TESTE 1: Verificar conexão com Supabase
      console.log('🔥 STEP 2: Testando conexão Supabase...');
      console.log('🔥 Supabase client existe?', !!supabase);
      
      // TESTE 2: Buscar TODOS os produtos primeiro
      console.log('🔥 STEP 3: Buscando TODOS os produtos...');
      const { data: allProducts, error: allError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('🔥 TODOS OS PRODUTOS:', {
        error: allError,
        count: allProducts?.length || 0,
        products: allProducts
      });

      if (allError) {
        console.error('❌ ERRO ao buscar todos produtos:', allError);
        throw allError;
      }

      if (!allProducts || allProducts.length === 0) {
        console.error('❌ NENHUM PRODUTO ENCONTRADO NO BANCO!');
        setNewProducts([]);
        setFeaturedProducts([]);
        setOfferProducts([]);
        setLoading(false);
        return;
      }

      console.log('✅ PRODUTOS ENCONTRADOS:', allProducts.length);

      // TESTE 3: Verificar produtos NOVOS
      console.log('🔥 STEP 4: Filtrando produtos NOVOS...');
      const newProductsFiltered = allProducts.filter(p => p.is_new === true);
      console.log('🆕 PRODUTOS NOVOS filtrados:', {
        count: newProductsFiltered.length,
        products: newProductsFiltered.map(p => ({ id: p.id, name: p.name, is_new: p.is_new }))
      });
      setNewProducts(newProductsFiltered.slice(0, 8));

      // TESTE 4: Verificar produtos EM DESTAQUE
      console.log('🔥 STEP 5: Filtrando produtos EM DESTAQUE...');
      const featuredProductsFiltered = allProducts.filter(p => p.is_featured === true);
      console.log('⭐ PRODUTOS EM DESTAQUE filtrados:', {
        count: featuredProductsFiltered.length,
        products: featuredProductsFiltered.map(p => ({ id: p.id, name: p.name, is_featured: p.is_featured }))
      });
      setFeaturedProducts(featuredProductsFiltered);

      // TESTE 5: Verificar produtos EM OFERTA
      console.log('🔥 STEP 6: Filtrando produtos EM OFERTA...');
      const offerProductsFiltered = allProducts.filter(p => 
        p.original_price && p.original_price > p.price
      );
      console.log('💰 PRODUTOS EM OFERTA filtrados:', {
        count: offerProductsFiltered.length,
        products: offerProductsFiltered.map(p => ({ 
          id: p.id, 
          name: p.name, 
          price: p.price, 
          original_price: p.original_price 
        }))
      });
      setOfferProducts(offerProductsFiltered.slice(0, 8));

      console.log('🎉 =================================');
      console.log('🎉 RESULTADO FINAL:');
      console.log('📊 Novos:', newProductsFiltered.length);
      console.log('📊 Destaques:', featuredProductsFiltered.length);
      console.log('📊 Ofertas:', offerProductsFiltered.length);
      console.log('🎉 =================================');

    } catch (error) {
      console.error('💥 =================================');
      console.error('💥 ERRO CRÍTICO em fetchProductsByType:');
      console.error('💥 Error object:', error);
      console.error('💥 Error message:', error?.message);
      console.error('💥 Error stack:', error?.stack);
      console.error('💥 =================================');
      secureLog.error('Erro crítico ao buscar produtos por tipo', error);
    } finally {
      setLoading(false);
      console.log('✨ useProductsByType: Loading finalizado');
    }
  };

  const refetch = () => {
    console.log('🔄 Refazendo busca de produtos...');
    setLoading(true);
    fetchProductsByType();
  };

  // Log do estado atual
  console.log('📊 Estado atual dos produtos:', {
    loading,
    newCount: newProducts.length,
    featuredCount: featuredProducts.length,
    offerCount: offerProducts.length
  });

  return {
    newProducts,
    featuredProducts,
    offerProducts,
    loading,
    refetch
  };
};
