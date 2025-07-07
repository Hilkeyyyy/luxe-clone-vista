
import React from 'react';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/admin/AdminGuard';
import { useAuth } from '@/hooks/useAuth';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import AdminNavigation from '@/components/admin/AdminNavigation';
import ProductCategories from '@/components/admin/ProductCategories';

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const { stats } = useRealTimeStats();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-50 font-outfit">
        <AdminHeader onLogout={handleLogout} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Bem-vindo de volta, Administrador!
            </h2>
            <p className="text-neutral-600">
              Gerencie seus produtos e configurações do sistema.
            </p>
          </motion.div>

          {/* Real-time Stats */}
          <AdminStats stats={stats} />

          {/* Product Categories Overview */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ProductCategories 
              onCategorySelect={() => {}} 
              showDescription={true}
            />
          </motion.div>

          <AdminNavigation />
        </div>
      </div>
    </AdminGuard>
  );
};

export default Admin;
