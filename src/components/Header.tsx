
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
  const [scrollY, setScrollY] = useState(0);

  // Detectar mobile e scroll
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
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
      <header className="bg-white/60 backdrop-blur-xl shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-outfit font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
                VELAR WATCHES
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Glassmorphism intensity based on scroll
  const blurIntensity = Math.min(scrollY / 100, 1);
  const headerStyle = {
    backgroundColor: `rgba(255, 255, 255, ${0.7 + blurIntensity * 0.2})`,
    backdropFilter: `blur(${20 + blurIntensity * 10}px)`,
    borderColor: `rgba(255, 255, 255, ${0.2 + blurIntensity * 0.3})`,
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 border-b shadow-lg transition-all duration-300"
      style={headerStyle}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo com Glassmorphism */}
          <motion.button 
            onClick={() => navigate('/')}
            className="flex items-center group"
            whileHover={!isMobile ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-outfit font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent group-hover:from-neutral-800 group-hover:via-neutral-600 group-hover:to-neutral-800 transition-all duration-300">
              VELAR WATCHES
            </h1>
          </motion.button>

          {/* Search Bar Desktop - Glassmorphism Premium */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-600 transition-colors duration-300" size={18} />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-300/50 focus:border-white/50 text-sm bg-white/40 backdrop-blur-md placeholder-neutral-500 shadow-lg hover:shadow-xl transition-all duration-300 focus:bg-white/60"
                  style={{
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  }}
                />
              </div>
            </form>
          </div>

          {/* Right side icons - Glassmorphism */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Mobile - Glassmorphism */}
            <div className="md:hidden">
              <motion.button 
                onClick={() => {
                  const searchInput = document.getElementById('mobile-search');
                  if (searchInput) searchInput.focus();
                }}
                className="p-3 text-neutral-700 hover:text-neutral-900 transition-colors rounded-2xl bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/40"
                whileTap={{ scale: 0.95 }}
                style={{
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Search size={18} />
              </motion.button>
            </div>

            {/* Favorites - Glassmorphism Premium */}
            <motion.button 
              onClick={() => navigate('/favorites')}
              className="relative p-3 text-neutral-700 hover:text-red-600 transition-all duration-300 rounded-2xl bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/40 group"
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -1 }}
              style={{
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Heart size={18} className="group-hover:fill-red-500 transition-all duration-300" />
              {favoritesCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-semibold shadow-lg border-2 border-white/50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart - Glassmorphism Premium */}
            <motion.button 
              onClick={() => navigate('/cart')}
              className="relative p-3 text-neutral-700 hover:text-neutral-900 transition-all duration-300 rounded-2xl bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/40 group"
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -1 }}
              style={{
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ShoppingBag size={18} className="group-hover:text-neutral-900 transition-colors duration-300" />
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-semibold shadow-lg border-2 border-white/50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Admin Settings - Glassmorphism */}
            {isAdmin && (
              <motion.button 
                onClick={() => navigate('/admin')}
                className="p-3 text-neutral-700 hover:text-blue-600 transition-all duration-300 rounded-2xl bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/40"
                whileTap={{ scale: 0.95 }}
                title="Painel Administrativo"
                style={{
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Settings size={18} />
              </motion.button>
            )}

            {/* Navigation Menu - Glassmorphism */}
            <div className="relative">
              <motion.button 
                onClick={() => setShowNavigationMenu(!showNavigationMenu)}
                className="p-3 text-neutral-700 hover:text-neutral-900 transition-all duration-300 rounded-2xl bg-white/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/40"
                whileTap={{ scale: 0.95 }}
                style={{
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
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

        {/* Mobile Search Bar - Glassmorphism */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-600 transition-colors duration-300" size={18} />
              <input
                id="mobile-search"
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-300/50 focus:border-white/50 text-sm bg-white/40 backdrop-blur-md placeholder-neutral-500 shadow-lg focus:shadow-xl transition-all duration-300 focus:bg-white/60"
                style={{
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
