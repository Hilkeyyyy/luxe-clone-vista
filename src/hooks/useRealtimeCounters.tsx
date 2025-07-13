
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
      // Contar favoritos no Supabase com timeout
      const favoritesPromise = supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Contar itens do carrinho no Supabase com timeout  
      const cartPromise = supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);

      // Executar consultas em paralelo com timeout de 5 segundos
      const [favoritesResult, cartResult] = await Promise.allSettled([
        Promise.race([
          favoritesPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]),
        Promise.race([
          cartPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ])
      ]);

      // Processar resultado dos favoritos
      let favCount = 0;
      if (favoritesResult.status === 'fulfilled' && favoritesResult.value) {
        const { count, error } = favoritesResult.value as any;
        if (!error) favCount = count || 0;
      }

      // Processar resultado do carrinho
      let totalCartItems = 0;
      if (cartResult.status === 'fulfilled' && cartResult.value) {
        const { data, error } = cartResult.value as any;
        if (!error && data) {
          totalCartItems = data.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        }
      }

      setFavoritesCount(favCount);
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

    // Polling mais frequente para garantir sincronização
    const interval = setInterval(updateCounters, 5000);

    // Realtime subscriptions do Supabase (se user existir)
    let favoritesChannel: any;
    let cartChannel: any;

    if (user?.id) {
      favoritesChannel = supabase
        .channel('favorites-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('🔔 Mudança nos favoritos detectada');
          handleUpdate();
        })
        .subscribe();

      cartChannel = supabase
        .channel('cart-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('🔔 Mudança no carrinho detectada');
          handleUpdate();
        })
        .subscribe();
    }

    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
      window.removeEventListener('cartUpdated', handleUpdate);
      clearInterval(interval);
      if (favoritesChannel) supabase.removeChannel(favoritesChannel);
      if (cartChannel) supabase.removeChannel(cartChannel);
    };
  }, [updateCounters, user?.id]);

  return { 
    favoritesCount, 
    cartCount, 
    loading,
    refresh: updateCounters 
  };
};
