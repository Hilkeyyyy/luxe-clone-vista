
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeCounters = () => {
  const { isAuthenticated, user } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateCounters = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setFavoritesCount(0);
      setCartCount(0);
      setLoading(false);
      return;
    }

    try {
      // Buscar favoritos do Supabase
      const { data: favoritesData, error: favError } = await supabase
        .from('favorites')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (favError) throw favError;

      // Buscar itens do carrinho do Supabase
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      const totalCartItems = cartData?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

      setFavoritesCount(favoritesData?.length || 0);
      setCartCount(totalCartItems);
    } catch (error) {
      console.error('Erro ao atualizar contadores:', error);
      setFavoritesCount(0);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Listeners para atualizações em tempo real
  useEffect(() => {
    // Atualização inicial
    updateCounters();

    // Event listeners para mudanças
    const handleUpdate = () => {
      setTimeout(updateCounters, 100); // Pequeno delay para garantir sincronização
    };

    // Adicionar listeners
    window.addEventListener('favoritesUpdated', handleUpdate);
    window.addEventListener('cartUpdated', handleUpdate);

    // Polling periódico para garantir sincronização
    const interval = setInterval(updateCounters, 5000);

    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
      window.removeEventListener('cartUpdated', handleUpdate);
      clearInterval(interval);
    };
  }, [updateCounters]);

  return { 
    favoritesCount, 
    cartCount, 
    loading,
    refresh: updateCounters 
  };
};
