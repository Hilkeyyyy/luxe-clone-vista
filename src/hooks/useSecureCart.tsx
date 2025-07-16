
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export const useSecureCart = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cache para melhor performance
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_DURATION = 30000; // 30 segundos

  // Carregar produtos do carrinho - OTIMIZADO COM CACHE
  const loadCartItems = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || !user) {
      console.log('🛒 Usuário não autenticado, limpando carrinho');
      setCartItems([]);
      setInitialized(true);
      return;
    }

    // Verificar cache
    const now = Date.now();
    if (!forceRefresh && initialized && (now - lastFetch) < CACHE_DURATION) {
      console.log('🛒 Usando cache do carrinho');
      return;
    }

    try {
      setLoading(true);
      console.log('🛒 Carregando itens do carrinho para usuário:', user.id);

      // Buscar itens do carrinho com dados dos produtos
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          selected_color,
          selected_size,
          products (
            id,
            name,
            brand,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (cartError) {
        console.error('❌ Erro ao carregar carrinho:', cartError);
        throw cartError;
      }

      // Transformar dados para o formato esperado
      const items: CartItem[] = (cartData || [])
        .filter(item => item.products) // Filtrar itens que têm produtos válidos
        .map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.products?.name || 'Produto não encontrado',
          brand: item.products?.brand || '',
          price: item.products?.price || 0,
          image: item.products?.images?.[0] || '',
          quantity: item.quantity,
          selectedColor: item.selected_color || undefined,
          selectedSize: item.selected_size || undefined,
        }));

      console.log('✅ Itens do carrinho carregados:', items.length);
      setCartItems(items);
      setLastFetch(now);
      
      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar carrinho.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [isAuthenticated, user, initialized, lastFetch, toast]);

  // Adicionar item ao carrinho - OTIMIZADO
  const addToCart = useCallback(async (
    productId: string,
    productName: string,
    quantity: number = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('➕ Adicionando produto ao carrinho:', { productId, quantity });

      // Verificar se item já existe no carrinho
      const existingItem = cartItems.find(item => 
        item.productId === productId && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
      );

      if (existingItem) {
        // Atualizar quantidade
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Adicionar novo item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            selected_color: selectedColor,
            selected_size: selectedSize,
          });

        if (error) throw error;

        // Recarregar carrinho
        await loadCartItems(true);
      }

    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw error;
    }
  }, [isAuthenticated, user, cartItems, loadCartItems]);

  // Atualizar quantidade - OTIMIZADO
  const updateQuantity = useCallback(async (cartItemId: string, newQuantity: number) => {
    if (!isAuthenticated || !user) return;

    try {
      if (newQuantity <= 0) {
        await removeItem(cartItemId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Atualizar estado local IMEDIATAMENTE
      setCartItems(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));

    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar quantidade.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, user, toast]);

  // Remover item do carrinho
  const removeItem = useCallback(async (cartItemId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Atualizar estado local IMEDIATAMENTE
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      toast({
        title: "Produto removido",
        description: "Item removido do carrinho com sucesso.",
        duration: 1500,
      });

    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover item do carrinho.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, user, toast]);

  // Limpar carrinho
  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      toast({
        title: "Carrinho limpo",
        description: "Todos os itens foram removidos do carrinho.",
        duration: 1500,
      });

    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao limpar carrinho.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, user, toast]);

  // Calcular valores - MEMOIZADO
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Inicializar quando usuário muda
  useEffect(() => {
    loadCartItems();
  }, [isAuthenticated, user?.id]);

  // Listener para atualizações em tempo real
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('🛒 Carrinho atualizado, recarregando...');
          loadCartItems(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user?.id, loadCartItems]);

  return {
    cartItems,
    loading,
    initialized,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice: getTotalPrice(),
    getTotalItems: getTotalItems(),
    refetch: () => loadCartItems(true),
  };
};
