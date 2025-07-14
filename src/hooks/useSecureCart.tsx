
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  
  // Flags para prevenir loops infinitos
  const mounted = useRef(true);
  const processing = useRef(false);

  const loadCartItems = useCallback(async () => {
    if (authLoading || processing.current || !mounted.current) {
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('🛒 Usuário não autenticado, limpando carrinho');
      setCartItems([]);
      setLoading(false);
      setInitialized(true);
      return;
    }

    processing.current = true;
    console.log('🛒 Carregando itens do carrinho para usuário:', user.id);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn('⏰ Timeout ao carregar carrinho');
      }, 5000);

      const { data: cartData, error } = await supabase
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
        .eq('user_id', user.id)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (!mounted.current) return;

      if (error) {
        console.error('❌ Erro ao carregar carrinho:', error);
        throw error;
      }

      console.log('✅ Dados do carrinho carregados:', cartData?.length || 0, 'itens');

      if (!cartData || cartData.length === 0) {
        setCartItems([]);
        setLoading(false);
        setInitialized(true);
        return;
      }

      const items: CartItem[] = cartData
        .filter(item => item.products) // Filtrar itens sem produto
        .map(item => {
          const product = item.products as any;
          return {
            id: item.id,
            productId: item.product_id,
            name: product?.name || 'Produto',
            brand: product?.brand || '',
            price: parseFloat(String(product?.price)) || 0,
            image: product?.images?.[0] || '/placeholder.svg',
            quantity: item.quantity,
            selectedColor: item.selected_color,
            selectedSize: item.selected_size,
          };
        });

      console.log('🛒 Itens processados:', items.length);
      setCartItems(items);

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error: any) {
      if (error.name !== 'AbortError' && mounted.current) {
        console.error('❌ Erro ao carregar carrinho:', error);
        setCartItems([]);
        toast({
          title: "Erro",
          description: "Erro ao carregar carrinho.",
          variant: "destructive",
        });
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
        setInitialized(true);
      }
      processing.current = false;
    }
  }, [user, isAuthenticated, authLoading, toast]);

  const addToCart = useCallback(async (productId: string, productName: string, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    console.log('🛒 Adicionando ao carrinho:', { productId, productName, quantity });

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
        console.log('🔄 Item já existe, atualizando quantidade');
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        console.log('➕ Criando novo item no carrinho');
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
        title: "✅ Adicionado ao carrinho!",
        description: `${quantity}x ${productName}`,
        duration: 2000,
      });

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error('❌ Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto.",
        variant: "destructive",
      });
    }
  }, [user, isAuthenticated, toast, loadCartItems]);

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

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error('❌ Erro ao atualizar:', error);
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
      
      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      toast({
        title: "Item removido",
        description: "Produto removido do carrinho.",
      });
    } catch (error) {
      console.error('❌ Erro ao remover:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover item.",
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
      
      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      toast({
        title: "Carrinho limpo",
        description: "Todos os itens removidos.",
      });
    } catch (error) {
      console.error('❌ Erro ao limpar:', error);
      toast({
        title: "Erro",
        description: "Erro ao limpar carrinho.",
        variant: "destructive",
      });
    }
  };

  const getTotalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getTotalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    mounted.current = true;
    
    // Só carregar quando auth estiver pronto e não inicializado ainda
    if (!authLoading && !initialized && !processing.current) {
      loadCartItems();
    }

    return () => {
      mounted.current = false;
    };
  }, [loadCartItems, authLoading, initialized]);

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
