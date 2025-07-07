import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  productId: string;
}

export const useSecureCart = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const loadCartItems = async () => {
    if (authLoading) {
      console.log('🔄 Aguardando autenticação...');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('🔒 Usuário não autenticado');
      setCartItems([]);
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      console.log('🛒 Carregando carrinho do usuário:', user.id.substring(0, 8));
      
      // OTIMIZAÇÃO: Query única com JOIN para pegar carrinho + produtos
      const { data: cartWithProducts, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          selected_color,
          selected_size,
          product_id,
          products (
            id,
            name,
            brand,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erro ao buscar carrinho:', error);
        throw error;
      }

      if (!cartWithProducts || cartWithProducts.length === 0) {
        setCartItems([]);
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Mapear dados do carrinho
      const cartItems = cartWithProducts.map(cartItem => {
        const product = cartItem.products as any;
        return {
          id: cartItem.id,
          productId: cartItem.product_id,
          name: product?.name || 'Produto não encontrado',
          brand: product?.brand || '',
          price: Number(product?.price) || 0,
          image: product?.images?.[0] || '/placeholder.svg',
          quantity: cartItem.quantity,
          selectedColor: cartItem.selected_color,
          selectedSize: cartItem.selected_size,
        };
      });

      console.log(`✅ ${cartItems.length} itens no carrinho carregados`);
      setCartItems(cartItems);
    } catch (error) {
      console.error('❌ Erro ao carregar carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar itens do carrinho.",
        variant: "destructive",
      });
      setCartItems([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const addToCart = async (productId: string, productName: string, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingItem, error: searchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('selected_color', selectedColor || '')
        .eq('selected_size', selectedSize || '')
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingItem) {
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            selected_color: selectedColor || null,
            selected_size: selectedSize || null,
          });

        if (insertError) throw insertError;
      }

      await loadCartItems();
      
      toast({
        title: "🛒 Produto adicionado ao carrinho!",
        description: `${quantity}x ${productName} foi adicionado ao seu carrinho.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('❌ Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(cartItemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setCartItems(prev => 
        prev.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('❌ Erro ao atualizar quantidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar quantidade.",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      
      toast({
        title: "Item removido",
        description: "Produto removido do carrinho.",
      });
    } catch (error) {
      console.error('❌ Erro ao remover item:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover item do carrinho.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      
      toast({
        title: "Carrinho limpo",
        description: "Todos os itens foram removidos do carrinho.",
      });
    } catch (error) {
      console.error('❌ Erro ao limpar carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao limpar carrinho.",
        variant: "destructive",
      });
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    if (!authLoading) {
      loadCartItems();
    }
  }, [isAuthenticated, user?.id, authLoading]);

  return {
    cartItems,
    loading: loading || authLoading,
    initialized,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refetch: loadCartItems,
  };
};
