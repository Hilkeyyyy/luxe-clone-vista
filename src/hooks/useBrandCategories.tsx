
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
    
    // Configurar realtime para atualizações instantâneas - CORRIGIDO
    const channel = supabase
      .channel('brand-categories-real-time')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brand_categories'
        },
        () => {
          console.log('🔄 Categoria atualizada, recarregando...');
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
        () => {
          console.log('🔄 Produto atualizado, recarregando categorias...');
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOnly]);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Buscando categorias com contagem CORRETA em tempo real...');
      
      // CORREÇÃO: Buscar categorias e contar produtos corretamente por marca
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

      // Para cada categoria, contar produtos CORRETAMENTE por marca
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .ilike('brand', category.name) // Buscar por marca que corresponde ao nome da categoria
            .eq('in_stock', true)
            .eq('is_sold_out', false);

          if (countError) {
            console.error(`❌ Erro ao contar produtos para ${category.name}:`, countError);
            return { ...category, products_count: 0 };
          }

          console.log(`✅ ${category.name}: ${count || 0} produtos`);
          return { ...category, products_count: count || 0 };
        })
      );

      console.log('✅ Categorias carregadas com contagem correta:', categoriesWithCount.map(c => `${c.name}: ${c.products_count} produtos`));
      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, refetch: fetchCategories };
};
