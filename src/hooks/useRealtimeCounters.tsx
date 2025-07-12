
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
      // Contar favoritos no Supabase
      const { count: favCount, error: favError } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (favError) throw favError;

      // Contar itens do carrinho no Supabase  
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      const totalCartItems = cartData?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

      setFavoritesCount(favCount || 0);
      setCartCount(totalCartItems);

      console.log('📊 Contadores atualizados:', { favoritos: favCount, carrinho: totalCartItems });
    } catch (error) {
      console.error('❌ Erro ao atualizar contadores:', error);
      setFavoritesCount(0);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Listeners para atualizações em tempo real
  useEffect(() => {
    updateCounters();

    const handleUpdate = () => {
      console.log('🔄 Evento de atualização recebido');
      setTimeout(updateCounters, 200);
    };

    // Event listeners
    window.addEventListener('favoritesUpdated', handleUpdate);
    window.addEventListener('cartUpdated', handleUpdate);

    // Polling para garantir sincronização
    const interval = setInterval(updateCounters, 10000);

    // Realtime subscriptions do Supabase
    const favoritesChannel = supabase
      .channel('favorites-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'favorites',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        console.log('🔔 Mudança nos favoritos detectada');
        handleUpdate();
      })
      .subscribe();

    const cartChannel = supabase
      .channel('cart-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cart_items',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        console.log('🔔 Mudança no carrinho detectada');
        handleUpdate();
      })
      .subscribe();

    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
      window.removeEventListener('cartUpdated', handleUpdate);
      clearInterval(interval);
      supabase.removeChannel(favoritesChannel);
      supabase.removeChannel(cartChannel);
    };
  }, [updateCounters, user?.id]);

  return { 
    favoritesCount, 
    cartCount, 
    loading,
    refresh: updateCounters 
  };
};
