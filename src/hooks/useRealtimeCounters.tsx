
import { useState, useEffect } from 'react';

export const useRealtimeCounters = () => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const updateFavoritesCount = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoritesCount(favorites.length);
      console.log('Favoritos atualizados:', favorites.length);
    } catch (error) {
      console.error('Erro ao atualizar contador de favoritos:', error);
      setFavoritesCount(0);
    }
  };

  const updateCartCount = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
      console.log('Carrinho atualizado:', totalItems);
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
      console.log('Evento favoritesUpdated disparado');
      updateFavoritesCount();
    };

    const handleCartUpdate = () => {
      console.log('Evento cartUpdated disparado');
      updateCartCount();
    };

    // Adicionar event listeners
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // CORREÇÃO: Adicionar listeners também para storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        updateFavoritesCount();
      } else if (e.key === 'cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Forçar atualização manual
  const forceUpdate = () => {
    updateFavoritesCount();
    updateCartCount();
  };

  return {
    favoritesCount,
    cartCount,
    forceUpdate,
  };
};
