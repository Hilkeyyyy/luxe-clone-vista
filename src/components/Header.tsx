
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSecureFavorites } from '@/hooks/useSecureFavorites';
import { useSecureCart } from '@/hooks/useSecureCart';
import NavigationMenu from './NavigationMenu';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { favoriteIds, loading: favoritesLoading } = useSecureFavorites();
  const { cartItems, loading: cartLoading } = useSecureCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);

  // Verificar se é admin pelos UIDs específicos
  const isAdmin = user && (
    user.id === '589069fc-fb82-4388-a802-40d373950011' ||
    user.id === '0fef94be-d716-4b9c-8053-e351a66927dc'
  );

  // Calcular contadores em tempo real do banco de dados
  const favoritesCount = favoriteIds.length;
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Limpeza completa do localStorage na inicialização
  useEffect(() => {
    console.log('🧹 HEADER: Limpando localStorage obsoleto...');
    
    // Remover dados antigos de carrinho e favoritos do localStorage
    const keysToRemove = ['cart', 'favorites', 'cartItems', 'favoriteItems'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Removendo ${key} do localStorage`);
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ localStorage limpo - agora usando apenas banco de dados');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  console.log('📊 CONTADORES ATUAIS:', {
    favoritos: favoritesCount,
    carrinho: cartItemsCount,
    autenticado: isAuthenticated,
    isAdmin,
    userId: user?.id?.substring(0, 8)
  });

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
              onClick={() => navigate('/favorites')}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={20} />
              {!favoritesLoading && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button 
              onClick={() => navigate('/cart')}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              {!cartLoading && cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>

            {/* Admin Settings - Only for the two specific UIDs */}
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
