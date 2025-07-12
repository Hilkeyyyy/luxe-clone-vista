
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
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Loading state otimizado
  if (authLoading) {
    return (
      <header className="bg-white/70 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-outfit font-bold text-neutral-900">
                VELAR WATCHES
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-neutral-200 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-neutral-200 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-neutral-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Glassmorphism baseado no scroll
  const blurIntensity = Math.min(scrollY / 100, 1);
  const headerStyle = {
    backgroundColor: `rgba(255, 255, 255, ${0.8 + blurIntensity * 0.1})`,
    backdropFilter: `blur(${12 + blurIntensity * 8}px)`,
    borderColor: `rgba(255, 255, 255, ${0.3 + blurIntensity * 0.2})`,
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 border-b shadow-sm transition-all duration-300"
      style={headerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Premium */}
          <motion.button 
            onClick={() => navigate('/')}
            className="flex items-center group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <h1 className="text-xl sm:text-2xl font-outfit font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors duration-300">
              VELAR WATCHES
            </h1>
          </motion.button>

          {/* Search Bar Desktop - Flat Premium */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-600 transition-colors duration-300" size={18} />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-300 focus:border-neutral-300 text-sm bg-white/60 backdrop-blur-sm placeholder-neutral-500 transition-all duration-300 hover:bg-white/80 focus:bg-white/90"
                  style={{
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                />
              </div>
            </form>
          </div>

          {/* Actions - Flat Premium */}
          <div className="flex items-center space-x-2">
            {/* Search Mobile */}
            <div className="md:hidden">
              <motion.button 
                onClick={() => {
                  const searchInput = document.getElementById('mobile-search');
                  if (searchInput) searchInput.focus();
                }}
                className="p-2.5 text-neutral-600 hover:text-neutral-900 transition-colors rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70"
                whileTap={{ scale: 0.95 }}
                style={{
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Search size={18} />
              </motion.button>
            </div>

            {/* Favorites - Flat Premium */}
            <motion.button 
              onClick={() => navigate('/favorites')}
              className="relative p-2.5 text-neutral-600 hover:text-red-500 transition-all duration-300 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70 group"
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -1 }}
              style={{
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <Heart size={18} className="group-hover:scale-110 transition-transform duration-200" />
              {favoritesCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart - Flat Premium */}
            <motion.button 
              onClick={() => navigate('/cart')}
              className="relative p-2.5 text-neutral-600 hover:text-neutral-900 transition-all duration-300 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70 group"
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -1 }}
              style={{
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform duration-200" />
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white"
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
                className="p-2.5 text-neutral-600 hover:text-blue-600 transition-all duration-300 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70"
                whileTap={{ scale: 0.95 }}
                title="Painel Administrativo"
                style={{
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Settings size={18} />
              </motion.button>
            )}

            {/* Navigation Menu */}
            <div className="relative">
              <motion.button 
                onClick={() => setShowNavigationMenu(!showNavigationMenu)}
                className="p-2.5 text-neutral-600 hover:text-neutral-900 transition-all duration-300 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70"
                whileTap={{ scale: 0.95 }}
                style={{
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
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

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-600 transition-colors duration-300" size={18} />
              <input
                id="mobile-search"
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-300 focus:border-neutral-300 text-sm bg-white/60 backdrop-blur-sm placeholder-neutral-500 transition-all duration-300"
                style={{
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
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
