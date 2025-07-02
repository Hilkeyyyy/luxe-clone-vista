
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, BarChart3, Settings } from 'lucide-react';

const AdminNavigation = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <button
        onClick={() => navigate('/admin/produtos')}
        className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-all text-left group"
      >
        <Package className="text-neutral-600 group-hover:text-neutral-900 mb-4" size={40} />
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Produtos</h3>
        <p className="text-neutral-600">Gerenciar produtos, categorias e estoque</p>
      </button>

      <button
        onClick={() => navigate('/admin/landing')}
        className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-all text-left group"
      >
        <BarChart3 className="text-neutral-600 group-hover:text-neutral-900 mb-4" size={40} />
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Landing Page</h3>
        <p className="text-neutral-600">Configurar carrosséis e seções da página inicial</p>
      </button>

      <button
        onClick={() => navigate('/admin/configuracoes')}
        className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-all text-left group"
      >
        <Settings className="text-neutral-600 group-hover:text-neutral-900 mb-4" size={40} />
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Configurações</h3>
        <p className="text-neutral-600">WhatsApp, site e outras configurações</p>
      </button>
    </motion.div>
  );
};

export default AdminNavigation;
