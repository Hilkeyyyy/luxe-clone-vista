
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeStats {
  totalProducts: number;
  totalCategories: number;
  recentActivity: number;
  productsByCategory: Record<string, number>;
  loading: boolean;
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    totalProducts: 0,
    totalCategories: 0,
    recentActivity: 0,
    productsByCategory: {},
    loading: true
  });

  const loadStats = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id, clone_category, created_at');

      if (products) {
        const totalProducts = products.length;
        
        // Contar produtos por categoria
        const productsByCategory = products.reduce((acc, product) => {
          const category = product.clone_category || 'Sem categoria';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const totalCategories = Object.keys(productsByCategory).length;

        // Calcular atividade recente (produtos criados nos últimos 7 dias)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentActivity = products.filter(product => 
          new Date(product.created_at) > sevenDaysAgo
        ).length;

        setStats({
          totalProducts,
          totalCategories,
          recentActivity,
          productsByCategory,
          loading: false
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadStats();
    
    // Atualizar estatísticas a cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    
    // Configurar listener para mudanças em tempo real
    const channel = supabase
      .channel('stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, refreshStats: loadStats };
};
