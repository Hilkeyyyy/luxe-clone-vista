
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
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
}

export const useCart = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useLocalStorage<any[]>('cart', []);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCartItems = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      if (cart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const productIds = cart.map((item: any) => item.productId);
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, brand, price, images')
        .in('id', productIds);

      if (error) throw error;

      const cartWithProducts = cart.map((cartItem: any) => {
        const product = products?.find(p => p.id === cartItem.productId);
        return {
          id: cartItem.productId,
          name: product?.name || 'Produto não encontrado',
          brand: product?.brand || '',
          price: product?.price || 0,
          image: product?.images?.[0] || '/placeholder.svg',
          quantity: cartItem.quantity,
          selectedColor: cartItem.selectedColor,
          selectedSize: cartItem.selectedSize,
        };
      });

      setCartItems(cartWithProducts);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar itens do carrinho.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cart.map((item: any) => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCart(updatedCart);
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter((item: any) => item.productId !== productId);
    setCart(updatedCart);
    setCartItems(prev => prev.filter(item => item.id !== productId));
    
    toast({
      title: "Item removido",
      description: "Produto removido do carrinho.",
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartItems([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho.",
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    loadCartItems();
  }, [cart, isAuthenticated]);

  return {
    cartItems,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refetch: loadCartItems,
  };
};
