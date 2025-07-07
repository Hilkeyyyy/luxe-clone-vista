
import { useToast } from '@/hooks/use-toast';
import { useSecureFavorites } from '@/hooks/useSecureFavorites';
import { useSecureCart } from '@/hooks/useSecureCart';
import { useAuth } from '@/hooks/useAuth';
import { useButtonFeedback } from '@/hooks/useButtonFeedback';
import { supabase } from '@/integrations/supabase/client';

export const useSecureProductActions = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useSecureFavorites();
  const { addToCart } = useSecureCart();
  const { triggerFeedback, setLoading, getButtonState } = useButtonFeedback();

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

  const handleAddToCart = async (productId: string, productName: string, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(productId, true);
      await addToCart(productId, productName, quantity, selectedColor, selectedSize);
      triggerFeedback(productId, 1500);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setLoading(productId, false);
    }
  };

  const getWhatsAppSettings = async () => {
    const { data } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'whatsapp_number')
      .single();
    
    const settingValue = data?.setting_value as any;
    return settingValue?.number || '';
  };

  const handleBuyNow = async (productId: string, productName: string, selectedColor?: string, selectedSize?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para finalizar compra.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Buscar dados do produto
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!productData) {
        toast({
          title: "Erro",
          description: "Produto não encontrado.",
          variant: "destructive",
        });
        return;
      }

      // Buscar configurações do WhatsApp
      const whatsappNumber = await getWhatsAppSettings();
      
      if (!whatsappNumber) {
        toast({
          title: "Erro",
          description: "WhatsApp não configurado. Entre em contato pelo site.",
          variant: "destructive",
        });
        return;
      }

      // Montar mensagem do WhatsApp
      const message = `Olá! Tenho interesse no produto:

📱 *${productData.name}*
🏷️ Marca: ${productData.brand}
💰 Preço: R$ ${productData.price.toFixed(2)}${selectedColor ? `\n🎨 Cor: ${selectedColor}` : ''}${selectedSize ? `\n📏 Tamanho: ${selectedSize}` : ''}
🖼️ Imagem: ${productData.images?.[0] || 'Sem imagem'}

Gostaria de mais informações!`;

      // Gerar URL do WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "📱 Redirecionando para WhatsApp",
        description: "Você será redirecionado para finalizar a compra no WhatsApp.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Erro ao abrir WhatsApp. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    toggleFavorite: handleToggleFavorite,
    addToCart: handleAddToCart,
    buyNow: handleBuyNow,
    isFavorite,
    getButtonState,
  };
};
