import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSecureFavorites } from '@/hooks/useSecureFavorites';
import { useSecureCart } from '@/hooks/useSecureCart';
import { useAuth } from '@/hooks/useAuth';

export const useSecureProductActions = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useSecureFavorites();
  const { addToCart, cartItems, getTotalPrice } = useSecureCart();
  
  // Estados para feedback instantâneo
  const [loadingStates, setLoadingStates] = useState<{[key: string]: { cart: boolean; favorite: boolean }}>({});
  const [successStates, setSuccessStates] = useState<{[key: string]: { cart: boolean; favorite: boolean }}>({});

  const setLoading = (productId: string, type: 'cart' | 'favorite', loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: loading
      }
    }));
  };

  const setSuccess = (productId: string, type: 'cart' | 'favorite', success: boolean) => {
    setSuccessStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: success
      }
    }));
    
    // Limpar estado de sucesso após 2 segundos
    setTimeout(() => {
      setSuccessStates(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [type]: false
        }
      }));
    }, 2000);
  };

  // FEEDBACK INSTANTÂNEO PARA FAVORITOS
  const handleToggleFavorite = async (productId: string, productName: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar aos favoritos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(productId, 'favorite', true);
      
      await toggleFavorite(productId, productName);
      setSuccess(productId, 'favorite', true);
      
      // Disparar eventos para atualizar contadores IMEDIATAMENTE
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar favorito.",
        variant: "destructive",
      });
    } finally {
      setLoading(productId, 'favorite', false);
    }
  };

  // FEEDBACK INSTANTÂNEO NO CARRINHO
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
      setLoading(productId, 'cart', true);
      
      await addToCart(productId, productName, quantity, selectedColor, selectedSize);
      setSuccess(productId, 'cart', true);
      
      // Disparar eventos para atualizar contadores IMEDIATAMENTE
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      toast({
        title: "✅ Produto adicionado!",
        description: `${quantity}x ${productName} foi adicionado ao carrinho.`,
        duration: 2000,
      });
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto ao carrinho.",
        variant: "destructive",
      });
    } finally {
      setLoading(productId, 'cart', false);
    }
  };

  // WHATSAPP PRODUTO ESPECÍFICO - NOVA FORMATAÇÃO CORRIGIDA
  const handleBuySpecificProduct = async (productId: string, productName: string, brand: string, price: number, image: string, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    try {
      const whatsappNumber = "19999413755";
      
      let message = `🛒 INTERESSE CONFIRMADO NO PRODUTO!\n\n`;
      message += `📦 PRODUTO SELECIONADO:\n`;
      message += `🏷️ ${productName}\n`;
      message += `🔹 Marca: ${brand}\n`;
      message += `💰 Valor: R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
      message += `📦 Quantidade: ${quantity} unidade${quantity > 1 ? 's' : ''}\n`;
      
      if (selectedColor) {
        message += `🎨 Cor: ${selectedColor}\n`;
      }
      if (selectedSize) {
        message += `📏 Tamanho: ${selectedSize}\n`;
      }
      
      if (image) {
        message += `📸 Imagem do produto:\n${image}\n`;
      }
      
      message += `\n📞 Gostaria de receber mais informações sobre este produto!\n`;
      message += `💳 Quais são as formas de pagamento disponíveis?\n`;
      message += `🚚 Como funciona a entrega?\n\n`;
      message += `Aguardo retorno para finalizar a compra!`;

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

  // Função para enviar todo o carrinho - CORRIGIDA
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
      const whatsappNumber = "19999413755";
      let message = `🛒 Pedido do Carrinho\n\n`;

      cartItems.forEach((item, index) => {
        message += `🧾 Produto: ${item.name}\n`;
        message += `📦 Quantidade: ${item.quantity}x\n`;
        message += `💸 Valor unitário: R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        
        if (item.selectedColor) {
          message += `🎨 Cor: ${item.selectedColor}\n`;
        }
        if (item.selectedSize) {
          message += `📏 Tamanho: ${item.selectedSize}\n`;
        }
        
        if (item.image) {
          message += `🖼️ Imagem do produto:\n${item.image}\n`;
        }
        
        if (index < cartItems.length - 1) {
          message += `\n`;
        }
      });

      const totalPrice = getTotalPrice;
      message += `\n💰 Total do Pedido: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

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

  // Getter para estados dos botões
  const getButtonState = (productId: string) => ({
    isCartLoading: loadingStates[productId]?.cart || false,
    isCartAdded: successStates[productId]?.cart || false,
    isFavoriteLoading: loadingStates[productId]?.favorite || false,
    isFavoriteAdded: successStates[productId]?.favorite || false,
  });

  return {
    toggleFavorite: handleToggleFavorite,
    addToCart: handleAddToCart,
    buyNow: handleBuyNow,
    buySpecificProduct: handleBuySpecificProduct,
    isFavorite,
    getButtonState,
  };
};
