
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
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoritesCount(favorites.length);
  }, [isAuthenticated]);

  const updateCartCount = useCallback(() => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    setCartCount(totalItems);
  }, [isAuthenticated]);

  // Listeners para atualizações instantâneas
  useEffect(() => {
    updateFavoritesCount();
    updateCartCount();

    const handleFavoritesUpdate = () => updateFavoritesCount();
    const handleCartUpdate = () => updateCartCount();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'favorites') updateFavoritesCount();
      if (e.key === 'cart') updateCartCount();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [updateFavoritesCount, updateCartCount]);

  return { favoritesCount, cartCount };
};
