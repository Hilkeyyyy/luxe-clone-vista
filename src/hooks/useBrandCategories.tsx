
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
    
    // Configurar realtime para atualizações instantâneas
    const channel = supabase
      .channel('brand-categories-changes')
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
      console.log('🔍 Buscando categorias com contagem correta...');
      
      let query = supabase
        .from('brand_categories')
        .select('*')
        .order('order_position', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erro ao buscar categorias:', error);
        throw error;
      }

      console.log('✅ Categorias carregadas:', data?.map(c => `${c.name}: ${c.products_count} produtos`));
      setCategories(data || []);
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, refetch: fetchCategories };
};
