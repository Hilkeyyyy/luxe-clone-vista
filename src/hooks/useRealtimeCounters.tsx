
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useRealtimeCounters = () => {
  const { isAuthenticated } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const updateFavoritesCount = useCallback(() => {
    if (!isAuthenticated) {
      setFavoritesCount(0);
      return;
    }
    
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const validFavorites = Array.isArray(favorites) ? favorites : [];
      setFavoritesCount(validFavorites.length);
    } catch (error) {
      console.error('Erro ao contar favoritos:', error);
      setFavoritesCount(0);
    }
  }, [isAuthenticated]);

  const updateCartCount = useCallback(() => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const validCart = Array.isArray(cart) ? cart : [];
      const totalItems = validCart.reduce((sum: number, item: any) => {
        return sum + (typeof item.quantity === 'number' ? item.quantity : 1);
      }, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error('Erro ao contar carrinho:', error);
      setCartCount(0);
    }
  }, [isAuthenticated]);

  // Listeners para atualizações instantâneas
  useEffect(() => {
    // Atualização inicial
    updateFavoritesCount();
    updateCartCount();

    // Event listeners para mudanças
    const handleFavoritesUpdate = () => {
      setTimeout(updateFavoritesCount, 50); // Pequeno delay para garantir sincronização
    };
    
    const handleCartUpdate = () => {
      setTimeout(updateCartCount, 50);
    };
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        setTimeout(updateFavoritesCount, 50);
      }
      if (e.key === 'cart') {
        setTimeout(updateCartCount, 50);
      }
    };

    // Adicionar listeners
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorage);

    // Polling para garantir sincronização (fallback)
    const interval = setInterval(() => {
      updateFavoritesCount();
      updateCartCount();
    }, 2000);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [updateFavoritesCount, updateCartCount]);

  return { favoritesCount, cartCount };
};
