
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Menu, Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    updateCounts();
    window.addEventListener('storage', updateCounts);
    return () => window.removeEventListener('storage', updateCounts);
  }, []);

  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setCartItemsCount(cart.reduce((total: number, item: any) => total + item.quantity, 0));
    setFavoritesCount(favs.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
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
              Mega Clones
            </h1>
          </motion.button>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-neutral-700 hover:text-neutral-900 font-outfit font-medium transition-colors"
            >
              Produtos
            </button>
            <button className="text-neutral-700 hover:text-neutral-900 font-outfit font-medium transition-colors">
              Categorias
            </button>
            <button className="text-neutral-700 hover:text-neutral-900 font-outfit font-medium transition-colors">
              Sobre
            </button>
            <button className="text-neutral-700 hover:text-neutral-900 font-outfit font-medium transition-colors">
              Contato
            </button>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <motion.button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={20} />
              </motion.button>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <motion.div
                  className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-xl border border-neutral-200 p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
                      autoFocus
                    />
                  </form>
                </motion.div>
              )}
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

      {/* Search overlay for mobile */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;
