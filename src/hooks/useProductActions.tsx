
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
          title: "Removido dos favoritos",
          description: `${productName} foi removido dos seus favoritos.`,
        });
      } else {
        setFavorites([...favorites, productId]);
        toast({
          title: "Adicionado aos favoritos",
          description: `${productName} foi adicionado aos seus favoritos.`,
        });
      }
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

      if (existingItemIndex >= 0) {
        const newCart = [...cart];
        newCart[existingItemIndex].quantity += quantity;
        setCart(newCart);
      } else {
        setCart([...cart, {
          productId,
          quantity,
          selectedColor: selectedColor || '',
          selectedSize: selectedSize || '',
        }]);
      }

      toast({
        title: "Produto adicionado!",
        description: `${quantity}x ${productName} foi adicionado ao seu carrinho.`,
      });
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return {
    toggleFavorite,
    addToCart,
    isFavorite,
    favorites,
    cart,
  };
};
