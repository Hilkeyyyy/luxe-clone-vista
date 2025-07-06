
import React from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CategoryManager from '@/components/admin/CategoryManager';

const AdminLanding = () => {
  const navigate = useNavigate();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-50 font-outfit">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Voltar ao Admin</span>
                </button>
                <span className="text-neutral-500">|</span>
                <h1 className="text-2xl font-bold text-neutral-900">Gerenciar Categorias</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategoryManager />
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminLanding;
