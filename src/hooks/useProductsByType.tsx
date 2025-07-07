
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
    console.log('🔄 useProductsByType: Iniciando carregamento...');
    fetchProductsByType();
  }, []);

  const fetchProductsByType = async () => {
    try {
      console.log('📦 Buscando produtos por tipo...');
      setLoading(true);

      // Buscar produtos novidades (is_new = true)
      console.log('🆕 Buscando produtos NOVOS...');
      const { data: newData, error: newError } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (newError) {
        console.error('❌ Erro ao buscar produtos novos:', newError);
        secureLog.error('Erro ao buscar produtos novos', newError);
      } else {
        console.log(`✅ Produtos novos encontrados: ${newData?.length || 0}`, newData);
        setNewProducts(newData || []);
      }

      // Buscar produtos em destaque (is_featured = true)
      console.log('⭐ Buscando produtos EM DESTAQUE...');
      const { data: featuredData, error: featuredError } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (featuredError) {
        console.error('❌ Erro ao buscar produtos em destaque:', featuredError);
        secureLog.error('Erro ao buscar produtos em destaque', featuredError);
      } else {
        console.log(`✅ Produtos em destaque encontrados: ${featuredData?.length || 0}`, featuredData);
        setFeaturedProducts(featuredData || []);
      }

      // Buscar produtos em oferta (que têm original_price > price)
      console.log('💰 Buscando produtos EM OFERTA...');
      const { data: offerData, error: offerError } = await supabase
        .from('products')
        .select('*')
        .not('original_price', 'is', null)
        .order('created_at', { ascending: false })
        .limit(8);

      if (offerError) {
        console.error('❌ Erro ao buscar produtos em oferta:', offerError);
        secureLog.error('Erro ao buscar produtos em oferta', offerError);
      } else {
        console.log(`📊 Produtos com preço original encontrados: ${offerData?.length || 0}`);
        
        // Filtrar apenas produtos que realmente estão em oferta
        const filteredOffers = offerData?.filter(product => {
          const isOffer = product.original_price && product.original_price > product.price;
          console.log(`🔍 Produto ${product.name}: original=${product.original_price}, atual=${product.price}, isOffer=${isOffer}`);
          return isOffer;
        }) || [];
        
        console.log(`✅ Produtos em oferta reais: ${filteredOffers.length}`, filteredOffers);
        setOfferProducts(filteredOffers);
      }

      console.log('🎉 Carregamento de produtos concluído!');

    } catch (error) {
      console.error('💥 Erro crítico ao buscar produtos por tipo:', error);
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
