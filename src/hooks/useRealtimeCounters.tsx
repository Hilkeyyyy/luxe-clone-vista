
import { useState, useEffect } from 'react';
import { useSecureFavorites } from '@/hooks/useSecureFavorites';
import { useSecureCart } from '@/hooks/useSecureCart';

export const useRealtimeCounters = () => {
  const { favoriteProducts, initialized: favoritesInitialized } = useSecureFavorites();
  const { cartItems, initialized: cartInitialized } = useSecureCart();
  
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Atualizar contadores baseado nos hooks seguros - OTIMIZADO
  useEffect(() => {
    if (favoritesInitialized) {
      const newFavoritesCount = favoriteProducts.length;
      setFavoritesCount(newFavoritesCount);
      console.log('🔄 Favoritos atualizados:', newFavoritesCount);
    }
  }, [favoriteProducts, favoritesInitialized]);

  useEffect(() => {
    if (cartInitialized) {
      const newCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(newCartCount);
      console.log('🔄 Carrinho atualizado:', newCartCount);
    }
  }, [cartItems, cartInitialized]);

  // Event listeners para atualizações INSTANTÂNEAS em tempo real
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      if (favoritesInitialized) {
        const count = favoriteProducts.length;
        setFavoritesCount(count);
        console.log('⚡ Evento favoritesUpdated - contagem:', count);
      }
    };

    const handleCartUpdate = () => {
      if (cartInitialized) {
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
        console.log('⚡ Evento cartUpdated - contagem:', count);
      }
    };

    // Adicionar event listeners personalizados
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [favoriteProducts, cartItems, favoritesInitialized, cartInitialized]);

  // Forçar atualização manual - OTIMIZADO
  const forceUpdate = () => {
    console.log('🔄 Forçando atualização dos contadores');
    if (favoritesInitialized) {
      setFavoritesCount(favoriteProducts.length);
    }
    if (cartInitialized) {
      setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    }
  };

  return {
    favoritesCount,
    cartCount,
    forceUpdate,
    isReady: favoritesInitialized && cartInitialized,
  };
};
