
import { useState, useEffect, useCallback } from 'react';
import { useSecureFavorites } from '@/hooks/useSecureFavorites';
import { useSecureCart } from '@/hooks/useSecureCart';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeCounters = () => {
  const { favoriteProducts, initialized: favoritesInitialized } = useSecureFavorites();
  const { cartItems, initialized: cartInitialized } = useSecureCart();
  
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState({ favorites: false, cart: false });

  // Animação visual para feedback
  const animateCounter = useCallback((type: 'favorites' | 'cart') => {
    setIsAnimating(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setIsAnimating(prev => ({ ...prev, [type]: false }));
    }, 300);
  }, []);

  // Atualizar contadores com animação - OTIMIZADO
  useEffect(() => {
    if (favoritesInitialized) {
      const newCount = favoriteProducts.length;
      if (newCount !== favoritesCount) {
        setFavoritesCount(newCount);
        animateCounter('favorites');
        console.log('❤️ Favoritos atualizados:', newCount);
      }
    }
  }, [favoriteProducts, favoritesInitialized, favoritesCount, animateCounter]);

  useEffect(() => {
    if (cartInitialized) {
      const newCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      if (newCount !== cartCount) {
        setCartCount(newCount);
        animateCounter('cart');
        console.log('🛒 Carrinho atualizado:', newCount);
      }
    }
  }, [cartItems, cartInitialized, cartCount, animateCounter]);

  // Realtime updates INSTANTÂNEOS
  useEffect(() => {
    if (!favoritesInitialized || !cartInitialized) return;

    const channel = supabase
      .channel('realtime-counters-optimized')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites'
        },
        () => {
          console.log('⚡ Favoritos - mudança detectada');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items'
        },
        () => {
          console.log('⚡ Carrinho - mudança detectada');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [favoritesInitialized, cartInitialized]);

  // Event listeners customizados para atualizações INSTANTÂNEAS
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      const count = favoriteProducts.length;
      setFavoritesCount(count);
      animateCounter('favorites');
      console.log('⚡ Evento personalizado - favoritos:', count);
    };

    const handleCartUpdate = () => {
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
      animateCounter('cart');
      console.log('⚡ Evento personalizado - carrinho:', count);
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [favoriteProducts, cartItems, animateCounter]);

  return {
    favoritesCount,
    cartCount,
    isAnimating,
    isReady: favoritesInitialized && cartInitialized,
  };
};
