
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeCounters } from '@/hooks/useRealtimeCounters';
import NavigationMenu from './NavigationMenu';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { favoritesCount, cartCount } = useRealtimeCounters();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Loading state otimizado para mobile
  if (authLoading) {
    return (
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-neutral-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-outfit font-bold text-neutral-900">
                VELAR WATCHES
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral-200 rounded animate-pulse"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral-200 rounded animate-pulse"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md shadow-sm border-b border-neutral-200/50 sticky top-0 z-50"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <motion.button 
            onClick={() => navigate('/')}
            className="flex items-center"
            whileHover={!isMobile ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-outfit font-bold text-neutral-900 truncate">
              VELAR WATCHES
            </h1>
          </motion.button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-sm bg-white/70 backdrop-blur-sm"
                />
              </div>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search - Mobile */}
            <div className="md:hidden">
              <motion.button 
                onClick={() => {
                  const searchInput = document.getElementById('mobile-search');
                  if (searchInput) searchInput.focus();
                }}
                className="p-2.5 text-neutral-700 hover:text-neutral-900 transition-colors rounded-xl hover:bg-neutral-100/70 backdrop-blur-sm"
                whileTap={{ scale: 0.95 }}
              >
                <Search size={18} />
              </motion.button>
            </div>

            {/* Favorites */}
            <motion.button 
              onClick={() => navigate('/favorites')}
              className="p-2.5 text-neutral-700 hover:text-neutral-900 transition-colors relative rounded-xl hover:bg-neutral-100/70 backdrop-blur-sm"
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={18} />
              {favoritesCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button 
              onClick={() => navigate('/cart')}
              className="p-2.5 text-neutral-700 hover:text-neutral-900 transition-colors relative rounded-xl hover:bg-neutral-100/70 backdrop-blur-sm"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Admin Settings */}
            {isAdmin && (
              <motion.button 
                onClick={() => navigate('/admin')}
                className="p-2.5 text-neutral-700 hover:text-neutral-900 transition-colors rounded-xl hover:bg-neutral-100/70 backdrop-blur-sm"
                whileTap={{ scale: 0.95 }}
                title="Painel Administrativo"
              >
                <Settings size={18} />
              </motion.button>
            )}

            {/* Navigation Menu */}
            <div className="relative">
              <motion.button 
                onClick={() => setShowNavigationMenu(!showNavigationMenu)}
                className="p-2.5 text-neutral-700 hover:text-neutral-900 transition-colors rounded-xl hover:bg-neutral-100/70 backdrop-blur-sm"
                whileTap={{ scale: 0.95 }}
              >
                <User size={18} />
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
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                id="mobile-search"
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent text-sm bg-white/70 backdrop-blur-sm"
              />
            </div>
          </form>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
