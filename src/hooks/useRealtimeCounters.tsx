
import { useState, useEffect } from 'react';

export const useRealtimeCounters = () => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const updateFavoritesCount = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const newCount = favorites.length;
      console.log('❤️ Contador de favoritos atualizado:', newCount);
      setFavoritesCount(newCount);
    } catch (error) {
      console.error('Erro ao atualizar contador de favoritos:', error);
      setFavoritesCount(0);
    }
  };

  const updateCartCount = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      console.log('🛒 Contador de carrinho atualizado:', totalItems);
      setCartCount(totalItems);
    } catch (error) {
      console.error('Erro ao atualizar contador do carrinho:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Inicializar contadores
    updateFavoritesCount();
    updateCartCount();

    // CORREÇÃO CRÍTICA: Event listeners otimizados
    const handleFavoritesUpdate = () => {
      console.log('🔄 Evento favoritesUpdated disparado');
      updateFavoritesCount();
    };

    const handleCartUpdate = () => {
      console.log('🔄 Evento cartUpdated disparado');
      updateCartCount();
    };

    // Adicionar event listeners personalizados
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Event listeners para mudanças no localStorage (entre abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        updateFavoritesCount();
      } else if (e.key === 'cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Intervalo para atualização periódica (fallback)
    const interval = setInterval(() => {
      updateFavoritesCount();
      updateCartCount();
    }, 5000); // A cada 5 segundos

    // Cleanup
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Forçar atualização manual
  const forceUpdate = () => {
    console.log('🔄 Forçando atualização dos contadores');
    updateFavoritesCount();
    updateCartCount();
  };

  return {
    favoritesCount,
    cartCount,
    forceUpdate,
  };
};
