
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
          category,
          price,
          original_price,
          images,
          is_new,
          is_featured,
          clone_category,
          colors,
          sizes,
          stock_status,
          created_at
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
      } else {
        // Mapear dados para o tipo Product completo
        const mappedProducts: Product[] = allProducts.map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          clone_category: p.clone_category || 'Clone',
          price: parseFloat(String(p.price)) || 0,
          original_price: p.original_price ? parseFloat(String(p.original_price)) : undefined,
          images: p.images || [],
          colors: p.colors || [],
          sizes: p.sizes || [],
          is_new: Boolean(p.is_new),
          is_featured: Boolean(p.is_featured),
          stock_status: p.stock_status || 'in_stock',
          created_at: p.created_at,
          // Propriedades opcionais com valores padrão seguros
          is_bestseller: false,
          is_sold_out: false,
          is_coming_soon: false,
          in_stock: true
        }));

        // Aplicar filtros
        const novos = mappedProducts.filter(p => p.is_new);
        const destaques = mappedProducts.filter(p => p.is_featured);
        const ofertas = mappedProducts.filter(p => {
          return p.original_price && p.original_price > 0 && p.original_price > p.price;
        });

        console.log('📊 Produtos filtrados:', {
          total: mappedProducts.length,
          novos: novos.length,
          destaques: destaques.length,
          ofertas: ofertas.length
        });

        setNewProducts(novos);
        setFeaturedProducts(destaques);
        setOfferProducts(ofertas);
      }

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
