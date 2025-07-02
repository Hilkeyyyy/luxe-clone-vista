
import React from 'react';
import { motion } from 'framer-motion';
import { Package, BarChart3, Users } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  recentActivity: number;
}

interface AdminStatsProps {
  stats: DashboardStats;
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
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
          <Package className="text-neutral-400" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium">Categorias</p>
            <p className="text-3xl font-bold text-neutral-900">{stats.totalCategories}</p>
          </div>
          <BarChart3 className="text-neutral-400" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600 text-sm font-medium">Atividade Recente</p>
            <p className="text-3xl font-bold text-neutral-900">{stats.recentActivity}</p>
          </div>
          <Users className="text-neutral-400" size={32} />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminStats;
