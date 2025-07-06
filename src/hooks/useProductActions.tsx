
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuthActions } from '@/hooks/useAuthActions';

export const useProductActions = () => {
  const { toast } = useToast();
  const { requireAuth } = useAuthActions();
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [cart, setCart] = useLocalStorage<any[]>('cart', []);

  const toggleFavorite = (productId: string, productName: string) => {
    return requireAuth(() => {
      const isFavorite = favorites.includes(productId);
      
      if (isFavorite) {
        setFavorites(favorites.filter(id => id !== productId));
        toast({
          title: "❤️ Removido dos favoritos",
          description: `${productName} foi removido dos seus favoritos.`,
          duration: 3000,
        });
      } else {
        setFavorites([...favorites, productId]);
        toast({
          title: "❤️ Adicionado aos favoritos",
          description: `${productName} foi adicionado aos seus favoritos.`,
          duration: 3000,
        });
      }
      
      // Disparar evento customizado para atualizar contadores
      window.dispatchEvent(new Event('favoritesUpdated'));
    });
  };

  const addToCart = (productId: string, productName: string, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    return requireAuth(() => {
      const existingItemIndex = cart.findIndex(
        (item: any) => 
          item.productId === productId && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
      );

      let newCart;
      if (existingItemIndex >= 0) {
        newCart = [...cart];
        newCart[existingItemIndex].quantity += quantity;
        setCart(newCart);
      } else {
        newCart = [...cart, {
          productId,
          quantity,
          selectedColor: selectedColor || '',
          selectedSize: selectedSize || '',
        }];
        setCart(newCart);
      }

      toast({
        title: "🛒 Produto adicionado ao carrinho!",
        description: `${quantity}x ${productName} foi adicionado ao seu carrinho.`,
        duration: 3000,
      });
      
      // Disparar evento customizado para atualizar contadores
      window.dispatchEvent(new Event('cartUpdated'));
    });
  };

  const buyNow = (productId: string, productName: string, selectedColor?: string, selectedSize?: string) => {
    return requireAuth(() => {
      // Primeiro adiciona ao carrinho
      addToCart(productId, productName, 1, selectedColor, selectedSize);
      
      // Depois redireciona para o carrinho
      setTimeout(() => {
        window.location.href = '/cart';
      }, 500);
      
      toast({
        title: "🚀 Redirecionando para finalizar compra",
        description: `${productName} foi adicionado ao carrinho. Redirecionando...`,
        duration: 2000,
      });
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return {
    toggleFavorite,
    addToCart,
    buyNow,
    isFavorite,
    favorites,
    cart,
  };
};
