
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  order_position: number;
  is_active: boolean;
  products_count: number;
}

export const useBrandCategories = (activeOnly: boolean = false) => {
  const [categories, setCategories] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    
    // Realtime listener aprimorado para mudanças
    const channel = supabase
      .channel('brand-categories-realtime-fixed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brand_categories'
        },
        (payload) => {
          console.log('🔄 Categoria alterada:', payload.eventType, payload.new || payload.old);
          fetchCategories();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔄 Produto alterado, recarregando categorias:', payload.eventType);
          // Aguardar o trigger atualizar e então buscar novamente
          setTimeout(() => {
            fetchCategories();
          }, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOnly]);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Buscando categorias de marca...');
      
      // Buscar todas as categorias ativas do banco
      let categoriesQuery = supabase
        .from('brand_categories')
        .select('*')
        .order('order_position', { ascending: true });

      if (activeOnly) {
        categoriesQuery = categoriesQuery.eq('is_active', true);
      }

      const { data: categoriesData, error: categoriesError } = await categoriesQuery;

      if (categoriesError) {
        console.error('❌ Erro ao buscar categorias:', categoriesError);
        throw categoriesError;
      }

      console.log('📊 Categorias encontradas no banco:', categoriesData?.length || 0);

      // Se há categorias no banco, usar elas com a contagem já calculada
      if (categoriesData && categoriesData.length > 0) {
        console.log('✅ Usando categorias do banco com contagem automática');
        console.log('📋 Categorias:', categoriesData.map(c => `${c.name} (${c.products_count} produtos)`));
        
        const filteredCategories = activeOnly 
          ? categoriesData.filter(cat => cat.is_active)
          : categoriesData;

        setCategories(filteredCategories);
        setLoading(false);
        return;
      }

      // Fallback: se não há categorias, criar automaticamente baseadas nas marcas dos produtos
      console.log('⚠️ Nenhuma categoria no banco, criando fallback...');
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('brand')
        .eq('in_stock', true);

      if (!productsError && productsData && productsData.length > 0) {
        // Agrupar por marca e contar produtos
        const brandCounts = productsData.reduce((acc, product) => {
          const brand = product.brand;
          acc[brand] = (acc[brand] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const fallbackCategories = Object.entries(brandCounts).map(([brand, count]) => ({
          id: `fallback-${brand.toLowerCase().replace(/\s+/g, '-')}`,
          name: brand,
          slug: brand.toLowerCase().replace(/\s+/g, '-'),
          description: `Produtos da marca ${brand}`,
          image_url: '',
          order_position: 0,
          is_active: true,
          products_count: count
        }));

        console.log('✅ Categorias fallback criadas:', fallbackCategories.length);
        setCategories(fallbackCategories);
      } else {
        console.log('⚠️ Nenhum produto encontrado');
        setCategories([]);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, refetch: fetchCategories };
};
