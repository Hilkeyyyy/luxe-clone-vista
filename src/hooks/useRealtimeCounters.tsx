
import { useState, useEffect } from 'react';
import { useSecureFavorites } from '@/hooks/useSecureFavorites';
import { useSecureCart } from '@/hooks/useSecureCart';

export const useRealtimeCounters = () => {
  const { favoriteProducts } = useSecureFavorites();
  const { cartItems } = useSecureCart();
  
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Atualizar contadores baseado nos hooks seguros
  useEffect(() => {
    const newFavoritesCount = favoriteProducts.length;
    const newCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    console.log('🔄 Atualizando contadores:', { favoritos: newFavoritesCount, carrinho: newCartCount });
    
    setFavoritesCount(newFavoritesCount);
    setCartCount(newCartCount);
  }, [favoriteProducts, cartItems]);

  // Event listeners para atualizações em tempo real
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      console.log('🔄 Evento favoritesUpdated disparado');
      setFavoritesCount(favoriteProducts.length);
    };

    const handleCartUpdate = () => {
      console.log('🔄 Evento cartUpdated disparado');
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    // Adicionar event listeners personalizados
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [favoriteProducts, cartItems]);

  // Forçar atualização manual
  const forceUpdate = () => {
    console.log('🔄 Forçando atualização dos contadores');
    setFavoritesCount(favoriteProducts.length);
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
  };

  return {
    favoritesCount,
    cartCount,
    forceUpdate,
  };
};
