
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useLocalStorageCleanup } from '@/hooks/useLocalStorageCleanup';
import NavigationMenu from './NavigationMenu';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthCheck();
  const { cleanupInvalidData, resetLocalStorage } = useLocalStorageCleanup();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);

  useEffect(() => {
    console.log('🔧 Header: Inicializando contadores...');
    
    // Limpar dados inválidos primeiro
    cleanupInvalidData();
    updateCounts();
    
    // Listener para mudanças no localStorage
    const handleStorageChange = () => {
      console.log('📦 Storage mudou, atualizando contadores...');
      updateCounts();
    };

    // Listener customizado para mudanças imediatas
    const handleCartUpdate = () => {
      console.log('🛒 Carrinho atualizado, atualizando contadores...');
      setTimeout(updateCounts, 100);
    };

    const handleFavoritesUpdate = () => {
      console.log('❤️ Favoritos atualizados, atualizando contadores...');
      setTimeout(updateCounts, 100);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  const updateCounts = () => {
    console.log('🔄 Atualizando contadores...');
    
    try {
      const cart = localStorage.getItem('cart');
      const favorites = localStorage.getItem('favorites');
      
      console.log('📊 Dados brutos:', { cart, favorites });
      
      // CORREÇÃO CRÍTICA: Inicializar com 0 e só contar se houver dados válidos
      let totalCartItems = 0;
      let totalFavorites = 0;
      
      // Processar carrinho apenas se existir
      if (cart && cart !== 'null' && cart !== '[]') {
        try {
          const parsedCart = JSON.parse(cart);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            // Para o carrinho, somar as quantidades de todos os itens
            totalCartItems = parsedCart.reduce((total: number, item: any) => {
              if (item && typeof item.quantity === 'number' && item.quantity > 0) {
                return total + item.quantity;
              }
              return total;
            }, 0);
            console.log('🛒 Carrinho processado:', parsedCart.length, 'produtos,', totalCartItems, 'itens totais');
          }
        } catch (error) {
          console.error('❌ Erro ao processar carrinho:', error);
          localStorage.removeItem('cart');
        }
      }
      
      // Processar favoritos apenas se existir
      if (favorites && favorites !== 'null' && favorites !== '[]') {
        try {
          const parsedFavorites = JSON.parse(favorites);
          if (Array.isArray(parsedFavorites) && parsedFavorites.length > 0) {
            // Para favoritos, contar apenas IDs válidos e únicos
            const validFavorites = parsedFavorites.filter((id: any) => 
              typeof id === 'string' && id.trim().length > 0
            );
            
            // Remover duplicatas
            const uniqueFavorites = [...new Set(validFavorites)];
            totalFavorites = uniqueFavorites.length;
            console.log('❤️ Favoritos processados:', parsedFavorites.length, 'raw,', totalFavorites, 'válidos únicos');
          }
        } catch (error) {
          console.error('❌ Erro ao processar favoritos:', error);
          localStorage.removeItem('favorites');
        }
      }
      
      console.log('📈 Contadores finais:', {
        carrinho: totalCartItems,
        favoritos: totalFavorites
      });
      
      setCartItemsCount(totalCartItems);
      setFavoritesCount(totalFavorites);
      
    } catch (error) {
      console.error('❌ Erro geral ao atualizar contadores:', error);
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

  // Função de debug para casos extremos
  const handleResetStorage = () => {
    if (window.confirm('⚠️ ATENÇÃO: Isso vai limpar TODOS os dados do carrinho e favoritos. Confirmar?')) {
      resetLocalStorage();
      console.log('🔄 Storage resetado pelo usuário');
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
              onClick={() => navigate('/favorites')}
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
              onClick={() => navigate('/cart')}
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

            {/* DEBUG: Botão para reset em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleResetStorage}
                className="hidden text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
                title="DEBUG: Reset Storage"
              >
                🔄
              </button>
            )}
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
