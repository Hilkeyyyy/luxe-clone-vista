
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// HOOK OBSOLETO - MIGRADO PARA useSecureCart
// Este hook agora redireciona para o novo sistema baseado em banco de dados

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    console.log('⚠️ AVISO: useCart está obsoleto - use useSecureCart');
    
    // Limpar dados antigos do localStorage
    const oldCart = localStorage.getItem('cart');
    if (oldCart) {
      console.log('🗑️ Removendo dados antigos do carrinho do localStorage');
      localStorage.removeItem('cart');
    }
    
    toast({
      title: "Sistema Atualizado",
      description: "Seus dados agora são salvos com segurança no banco de dados. Faça login para acessar.",
      duration: 5000,
    });
  }, []);

  // Funções vazias para compatibilidade
  const addToCart = () => {
    console.log('⚠️ Use useSecureCart.addToCart()');
  };

  const removeFromCart = () => {
    console.log('⚠️ Use useSecureCart.removeItem()');
  };

  const updateQuantity = () => {
    console.log('⚠️ Use useSecureCart.updateQuantity()');
  };

  const clearCart = () => {
    console.log('⚠️ Use useSecureCart.clearCart()');
  };

  const getTotalPrice = () => 0;
  const getTotalItems = () => 0;

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
};
