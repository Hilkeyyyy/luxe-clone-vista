
import React from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';

const AdminSettings = () => {
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
                  <span>Voltar</span>
                </button>
                <span className="text-neutral-500">|</span>
                <h1 className="text-2xl font-bold text-neutral-900">Configurações</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="text-neutral-600" size={24} />
              <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
            </div>
            <p className="text-neutral-600">
              O painel de configurações está sendo desenvolvido. 
              Em breve você poderá configurar WhatsApp, dados da empresa e outras configurações do sistema.
            </p>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminSettings;
