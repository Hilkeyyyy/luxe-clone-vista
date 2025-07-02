
import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Menu } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-neutral-100 sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl font-outfit font-bold text-neutral-900">
              Mega Clones
            </h1>
          </motion.div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-neutral-700 hover:text-neutral-900 font-outfit font-medium transition-colors">
              Produtos
            </a>
            <a href="#" className="text-neutral-700 hover:text-neutral-900 font-outfit font-medium transition-colors">
              Categorias
            </a>
            <a href="#" className="text-neutral-700 hover:text-neutral-900 font-outfit font-medium transition-colors">
              Sobre
            </a>
            <a href="#" className="text-neutral-700 hover:text-neutral-900 font-outfit font-medium transition-colors">
              Contato
            </a>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <motion.button 
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} />
            </motion.button>
            <motion.button 
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
            </motion.button>
            <motion.button 
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
