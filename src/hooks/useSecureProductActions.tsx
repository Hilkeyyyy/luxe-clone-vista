
import { useToast } from '@/hooks/use-toast';
import { useSecureFavorites } from '@/hooks/useSecureFavorites';
import { useSecureCart } from '@/hooks/useSecureCart';
import { useAuth } from '@/hooks/useAuth';

export const useSecureProductActions = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useSecureFavorites();
  const { addToCart } = useSecureCart();

  const requireAuth = (action: () => void, actionName: string = 'esta ação') => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: `Faça login para ${actionName}.`,
        variant: "destructive",
      });
      return;
    }
    action();
  };

  const handleToggleFavorite = (productId: string, productName: string) => {
    requireAuth(() => toggleFavorite(productId, productName), 'adicionar aos favoritos');
  };

  const handleAddToCart = (productId: string, productName: string, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    requireAuth(() => addToCart(productId, productName, quantity, selectedColor, selectedSize), 'adicionar ao carrinho');
  };

  const handleBuyNow = (productId: string, productName: string, selectedColor?: string, selectedSize?: string) => {
    requireAuth(() => {
      addToCart(productId, productName, 1, selectedColor, selectedSize);
      
      setTimeout(() => {
        window.location.href = '/cart';
      }, 500);
      
      toast({
        title: "🚀 Redirecionando para finalizar compra",
        description: `${productName} foi adicionado ao carrinho. Redirecionando...`,
        duration: 2000,
      });
    }, 'finalizar compra');
  };

  return {
    toggleFavorite: handleToggleFavorite,
    addToCart: handleAddToCart,
    buyNow: handleBuyNow,
    isFavorite,
  };
};
