
import React from 'react';
import { motion } from 'framer-motion';
import { Package, BarChart3, TrendingUp, Clock } from 'lucide-react';

interface RealTimeStats {
  totalProducts: number;
  totalCategories: number;
  recentActivity: number;
  productsByCategory: Record<string, number>;
  loading: boolean;
}

interface AdminStatsProps {
  stats: RealTimeStats;
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  const formatCategoryData = () => {
    return Object.entries(stats.productsByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded mb-2"></div>
            <div className="h-8 bg-neutral-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium">Total de Produtos</p>
            <p className="text-3xl font-bold text-neutral-900">{stats.totalProducts}</p>
          </div>
          <Package className="text-blue-500" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium">Categorias</p>
            <p className="text-3xl font-bold text-neutral-900">{stats.totalCategories}</p>
          </div>
          <BarChart3 className="text-green-500" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium">Novos (7 dias)</p>
            <p className="text-3xl font-bold text-neutral-900">{stats.recentActivity}</p>
          </div>
          <TrendingUp className="text-orange-500" size={32} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium">Atualizado</p>
            <p className="text-sm font-medium text-green-600">Agora mesmo</p>
            <div className="mt-2">
              {formatCategoryData().map(([category, count]) => (
                <div key={category} className="flex justify-between text-xs text-neutral-600">
                  <span>{category}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
          <Clock className="text-purple-500" size={32} />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminStats;
