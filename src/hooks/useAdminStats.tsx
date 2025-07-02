
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  recentActivity: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    recentActivity: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id, clone_category');

      const totalProducts = products?.length || 0;
      const categories = new Set(products?.map(p => p.clone_category).filter(Boolean));
      const totalCategories = categories.size;

      setStats({
        totalProducts,
        totalCategories,
        recentActivity: Math.floor(Math.random() * 50) + 10 // Simulado
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  return { stats };
};
