
import React from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CategoryManager from '@/components/admin/CategoryManager';

const AdminCategories = () => {
  const navigate = useNavigate();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-50 font-outfit">
        {/* Header Premium */}
        <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-200/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Voltar ao Dashboard</span>
                </button>
                <span className="text-neutral-300">|</span>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Gerenciar Categorias</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-8">
            <CategoryManager />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminCategories;
