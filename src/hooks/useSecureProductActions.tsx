
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
  const { addToCart, cartItems, getTotalPrice } = useSecureCart();
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

  // CORREÇÃO 1: Comprar produto específico via WhatsApp SEM EXIGIR LOGIN
  const handleBuySpecificProduct = async (productId: string, productName: string, brand: string, price: number, image: string) => {
    try {
      const whatsappNumber = await getWhatsAppSettings();
      
      if (!whatsappNumber) {
        toast({
          title: "Erro",
          description: "WhatsApp não configurado. Entre em contato pelo site.",
          variant: "destructive",
        });
        return;
      }

      const storeUrl = window.location.origin;
      const productUrl = `${storeUrl}/products/${productId}`;
      
      let message = `🛒 *INTERESSE EM PRODUTO*\n\n`;
      message += `📋 *PRODUTO SELECIONADO:*\n\n`;
      message += `🏷️ *${productName}*\n`;
      message += `   • Marca: ${brand}\n`;
      message += `   • Preço: R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
      message += `   • Link: ${productUrl}\n\n`;
      message += `📞 Gostaria de mais informações sobre este produto!\n`;
      message += `Formas de pagamento e entrega disponíveis?`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "📱 Redirecionando para WhatsApp",
        description: `Enviando informações do produto ${productName}.`,
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

  // Função para enviar todo o carrinho (mantida para uso no carrinho)
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para finalizar compra.",
        variant: "destructive",
      });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    try {
      const whatsappNumber = await getWhatsAppSettings();
      
      if (!whatsappNumber) {
        toast({
          title: "Erro",
          description: "WhatsApp não configurado. Entre em contato pelo site.",
          variant: "destructive",
        });
        return;
      }

      const storeUrl = window.location.origin;
      let message = `🛒 *PEDIDO - RELÓGIOS*\n\n📋 *PRODUTOS:*\n\n`;

      cartItems.forEach((item, index) => {
        const productUrl = `${storeUrl}/products/${item.productId}`;
        const subtotal = item.price * item.quantity;
        
        message += `${index + 1}️⃣ *${item.name}*\n`;
        message += `   🏷️ Marca: ${item.brand}\n`;
        message += `   💰 Preço unitário: R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        message += `   📦 Quantidade: ${item.quantity}\n`;
        message += `   💵 Subtotal: R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        
        if (item.selectedColor) {
          message += `   🎨 Cor: ${item.selectedColor}\n`;
        }
        if (item.selectedSize) {
          message += `   📏 Tamanho: ${item.selectedSize}\n`;
        }
        
        message += `   🔗 Link: ${productUrl}\n\n`;
      });

      const totalPrice = getTotalPrice;
      message += `💰 *RESUMO FINANCEIRO:*\n`;
      message += `   • Total de itens: ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}\n`;
      message += `   • Valor total: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;
      message += `📞 Gostaria de finalizar este pedido!\n`;
      message += `Poderia me informar sobre formas de pagamento e entrega?`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "📱 Redirecionando para WhatsApp",
        description: `Enviando ${cartItems.length} produto(s) para finalizar compra.`,
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
    buyNow: handleBuyNow, // Para uso no carrinho (todos os produtos)
    buySpecificProduct: handleBuySpecificProduct, // Para produto específico SEM LOGIN
    isFavorite,
    getButtonState,
  };
};
