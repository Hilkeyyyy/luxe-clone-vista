
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import NavigationMenu from './NavigationMenu';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthCheck();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);

  useEffect(() => {
    updateCounts();
    window.addEventListener('storage', updateCounts);
    return () => window.removeEventListener('storage', updateCounts);
  }, []);

  const updateCounts = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      // Validar se os dados estão no formato correto
      const validCart = Array.isArray(cart) ? cart : [];
      const validFavs = Array.isArray(favs) ? favs : [];
      
      setCartItemsCount(validCart.reduce((total: number, item: any) => {
        return total + (typeof item.quantity === 'number' ? item.quantity : 0);
      }, 0));
      
      setFavoritesCount(validFavs.length);
    } catch (error) {
      console.error('Erro ao atualizar contadores:', error);
      setCartItemsCount(0);
      setFavoritesCount(0);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

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
          <motion.button 
            onClick={() => navigate('/')}
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl font-outfit font-bold text-neutral-900">
              VELAR WATCHES
            </h1>
          </motion.button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <div className="md:hidden">
              <motion.button 
                onClick={() => {
                  const searchInput = document.getElementById('mobile-search');
                  if (searchInput) searchInput.focus();
                }}
                className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={20} />
              </motion.button>
            </div>

            {/* Favorites */}
            <motion.button 
              onClick={() => navigate('/favoritos')}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button 
              onClick={() => navigate('/carrinho')}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>

            {/* Admin Settings - Only for Admins */}
            {isAdmin && (
              <motion.button 
                onClick={() => navigate('/admin')}
                className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Painel Administrativo"
              >
                <Settings size={20} />
              </motion.button>
            )}

            {/* Navigation Menu */}
            <div className="relative">
              <motion.button 
                onClick={() => setShowNavigationMenu(!showNavigationMenu)}
                className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={20} />
              </motion.button>

              <NavigationMenu 
                isOpen={showNavigationMenu} 
                onClose={() => setShowNavigationMenu(false)} 
                user={user}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                id="mobile-search"
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
