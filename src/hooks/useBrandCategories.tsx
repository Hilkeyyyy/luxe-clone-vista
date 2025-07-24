
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
    
    // REALTIME APRIMORADO: Escutar mudanças em brand_categories E products
    const channel = supabase
      .channel('brand-categories-realtime-enhanced')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brand_categories'
        },
        (payload) => {
          console.log('🔄 Categoria de marca alterada:', payload.eventType, payload.new || payload.old);
          fetchCategories();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔄 Produto inserido, atualizando contagem de categorias:', payload.new);
          // Delay pequeno para garantir que triggers do banco rodaram
          setTimeout(() => {
            fetchCategories();
          }, 500);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔄 Produto atualizado, verificando mudança de marca:', payload.new);
          // Verificar se a marca mudou
          if (payload.old && payload.new && payload.old.brand !== payload.new.brand) {
            console.log('🔄 Marca do produto mudou, atualizando categorias');
            setTimeout(() => {
              fetchCategories();
            }, 500);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔄 Produto deletado, atualizando contagem:', payload.old);
          setTimeout(() => {
            fetchCategories();
          }, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOnly]);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Buscando categorias de marca com contagem atualizada...');
      
      // Buscar categorias ordenadas por posição
      let query = supabase
        .from('brand_categories')
        .select('*')
        .order('order_position', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data: categoriesData, error: categoriesError } = await query;

      if (categoriesError) {
        console.error('❌ Erro ao buscar categorias:', categoriesError);
        throw categoriesError;
      }

      if (!categoriesData || categoriesData.length === 0) {
        console.log('⚠️ Nenhuma categoria encontrada');
        setCategories([]);
        return;
      }

      // Para cada categoria, contar produtos ativos da marca correspondente
      const categoriesWithCount = await Promise.all(
        categoriesData.map(async (category) => {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .ilike('brand', category.name)
            .eq('in_stock', true)
            .neq('is_sold_out', true);

          if (countError) {
            console.error(`❌ Erro ao contar produtos para ${category.name}:`, countError);
            return { ...category, products_count: 0 };
          }

          const productCount = count || 0;
          console.log(`✅ ${category.name}: ${productCount} produtos`);
          
          return { ...category, products_count: productCount };
        })
      );

      // Filtrar categorias com produtos se necessário
      const filteredCategories = activeOnly 
        ? categoriesWithCount.filter(cat => cat.products_count > 0)
        : categoriesWithCount;

      console.log('✅ Categorias carregadas:', filteredCategories.map(c => `${c.name} (${c.products_count} produtos)`));
      setCategories(filteredCategories);
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, refetch: fetchCategories };
};
