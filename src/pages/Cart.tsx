
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';

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

const Cart = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setLoading(false);
      return;
    }
    loadCartItems();
  }, [isAuthenticated]);

  const loadCartItems = async () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
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

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.map((item: any) => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter((item: any) => item.productId !== productId);
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(prev => prev.filter(item => item.id !== productId));
    
    toast({
      title: "Item removido",
      description: "Produto removido do carrinho.",
    });
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
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

  const handleWhatsAppOrder = () => {
    const message = cartItems.map(item => 
      `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ).join('\n');
    
    const total = getTotalPrice();
    const whatsappMessage = `🛒 *Pedido do Carrinho*\n\n${message}\n\n💰 *Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*\n\nOlá! Gostaria de finalizar este pedido. Poderia me informar sobre formas de pagamento e entrega?`;
    
    const whatsappUrl = `https://wa.me/5519999413755?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <ShoppingBag className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Faça login para ver seu carrinho
            </h2>
            <p className="text-neutral-600 mb-8">
              Entre na sua conta para acessar seus produtos salvos no carrinho.
            </p>
          </div>
        </div>
        <Footer />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode="login"
          onSuccess={() => {
            setShowAuthModal(false);
            loadCartItems();
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando carrinho...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-8 h-8 text-neutral-900" />
              <h1 className="text-3xl font-bold text-neutral-900">Meu Carrinho</h1>
            </div>
            <Link
              to="/produtos"
              className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Continuar Comprando</span>
            </Link>
          </div>
          
          {cartItems.length > 0 && (
            <p className="text-neutral-600">
              {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} no carrinho
            </p>
          )}
        </motion.div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden bg-neutral-50 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                            {item.brand}
                          </p>
                          <h3 className="font-semibold text-neutral-900 truncate">
                            {item.name}
                          </h3>
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="flex gap-4 mt-1 text-sm text-neutral-500">
                              {item.selectedColor && <span>Cor: {item.selectedColor}</span>}
                              {item.selectedSize && <span>Tamanho: {item.selectedSize}</span>}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-neutral-900">
                            R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-neutral-500">
                            R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} cada
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-neutral-100 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-neutral-200 rounded-l-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-neutral-200 rounded-r-lg transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-neutral-50 rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})</span>
                    <span>R$ {getTotalPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Frete</span>
                    <span className="text-green-600">A calcular</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-neutral-900">
                      <span>Total</span>
                      <span>R$ {getTotalPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                  >
                    Finalizar no WhatsApp
                  </Button>
                  
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="w-full"
                  >
                    Limpar Carrinho
                  </Button>
                </div>

                <p className="text-xs text-neutral-500 mt-4 text-center">
                  Você será redirecionado para o WhatsApp para finalizar seu pedido
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-neutral-600 mb-8">
              Explore nossa coleção e adicione produtos ao seu carrinho.
            </p>
            <Link
              to="/produtos"
              className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Explorar Produtos
            </Link>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
