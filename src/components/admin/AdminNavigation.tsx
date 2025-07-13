
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, BarChart3, Tags } from 'lucide-react';

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
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {navigationItems.map((item, index) => (
        <motion.button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="group bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg hover:border-neutral-300 transition-all duration-300 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <item.icon className="text-white" size={24} />
          </div>
          
          {/* Content */}
          <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
            {item.title}
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed group-hover:text-neutral-500 transition-colors">
            {item.description}
          </p>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default AdminNavigation;
