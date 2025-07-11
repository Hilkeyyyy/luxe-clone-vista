
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
      try {
        const currentFavorites = Array.isArray(favorites) ? favorites : [];
        const isFavorite = currentFavorites.includes(productId);
        
        let newFavorites;
        if (isFavorite) {
          newFavorites = currentFavorites.filter(id => id !== productId);
          setFavorites(newFavorites);
          toast({
            title: "❤️ Removido dos favoritos",
            description: `${productName} foi removido dos seus favoritos.`,
            duration: 2000,
          });
        } else {
          newFavorites = [...currentFavorites, productId];
          setFavorites(newFavorites);
          toast({
            title: "❤️ Adicionado aos favoritos",
            description: `${productName} foi adicionado aos seus favoritos.`,
            duration: 2000,
          });
        }
        
        // Força atualização do localStorage
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        
        // Disparar evento customizado para atualizar contadores
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        }, 100);
        
      } catch (error) {
        console.error('Erro ao alterar favorito:', error);
        toast({
          title: "Erro",
          description: "Erro ao alterar favorito.",
          variant: "destructive",
        });
      }
    });
  };

  const addToCart = (productId: string, productName: string, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    return requireAuth(() => {
      try {
        const currentCart = Array.isArray(cart) ? cart : [];
        const existingItemIndex = currentCart.findIndex(
          (item: any) => 
            item.productId === productId && 
            item.selectedColor === (selectedColor || '') && 
            item.selectedSize === (selectedSize || '')
        );

        let newCart;
        if (existingItemIndex >= 0) {
          newCart = [...currentCart];
          newCart[existingItemIndex].quantity = (newCart[existingItemIndex].quantity || 1) + quantity;
        } else {
          const newItem = {
            productId,
            quantity,
            selectedColor: selectedColor || '',
            selectedSize: selectedSize || '',
            addedAt: new Date().toISOString(),
          };
          newCart = [...currentCart, newItem];
        }
        
        setCart(newCart);
        
        // Força atualização do localStorage
        localStorage.setItem('cart', JSON.stringify(newCart));

        toast({
          title: "🛒 Produto adicionado ao carrinho!",
          description: `${quantity}x ${productName} foi adicionado ao seu carrinho.`,
          duration: 2000,
        });
        
        // Disparar evento customizado para atualizar contadores
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        }, 100);
        
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar produto ao carrinho.",
          variant: "destructive",
        });
      }
    });
  };

  const buyNow = (productId: string, productName: string, selectedColor?: string, selectedSize?: string) => {
    return requireAuth(() => {
      // Primeiro adiciona ao carrinho
      addToCart(productId, productName, 1, selectedColor, selectedSize);
      
      // Depois redireciona para o carrinho
      setTimeout(() => {
        window.location.href = '/cart';
      }, 1000);
      
      toast({
        title: "🚀 Redirecionando para finalizar compra",
        description: `${productName} foi adicionado ao carrinho. Redirecionando...`,
        duration: 3000,
      });
    });
  };

  const isFavorite = (productId: string) => {
    const currentFavorites = Array.isArray(favorites) ? favorites : [];
    return currentFavorites.includes(productId);
  };

  const isInCart = (productId: string) => {
    const currentCart = Array.isArray(cart) ? cart : [];
    return currentCart.some((item: any) => item.productId === productId);
  };

  return {
    toggleFavorite,
    addToCart,
    buyNow,
    isFavorite,
    isInCart,
    favorites: Array.isArray(favorites) ? favorites : [],
    cart: Array.isArray(cart) ? cart : [],
  };
};
