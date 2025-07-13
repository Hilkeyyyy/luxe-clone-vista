
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, BarChart3, Tags, Edit } from 'lucide-react';

const AdminNavigation = () => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      icon: Package,
      title: 'Produtos',
      description: 'Gerenciar produtos, estoque e preços',
      path: '/admin/products',
      color: 'from-neutral-600 to-neutral-700'
    },
    {
      icon: Tags,
      title: 'Categorias',
      description: 'Gerenciar categorias de marcas e landing page',
      path: '/admin/landing',
      color: 'from-neutral-700 to-neutral-800'
    },
    {
      icon: Edit,
      title: 'Editar Categorias',
      description: 'Editar e personalizar categorias existentes',
      path: '/admin/categorias',
      color: 'from-neutral-800 to-neutral-900'
    },
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'Estatísticas e relatórios detalhados',
      path: '/admin/dashboard',
      color: 'from-neutral-600 to-neutral-700'
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'WhatsApp, site e outras configurações',
      path: '/admin/settings',
      color: 'from-neutral-700 to-neutral-800'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-900/95 backdrop-blur-md">
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.h1 
            className="text-3xl font-bold text-neutral-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Painel Administrativo
          </motion.h1>
          <motion.p 
            className="text-neutral-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Gerencie produtos, categorias e configurações do sistema
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="group bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-neutral-200/50 hover:shadow-xl hover:border-neutral-300/50 transition-all duration-300 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <item.icon className="text-white" size={28} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-neutral-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed group-hover:text-neutral-500 transition-colors">
                {item.description}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNavigation;
