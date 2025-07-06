
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  selected_color: string;
  selected_size: string;
  quantity: number;
  brand: string;
  clone_category?: string;
  stock_status?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCartItems();
    window.addEventListener('storage', loadCartItems);
    return () => window.removeEventListener('storage', loadCartItems);
  }, []);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Item removido",
      description: "O produto foi removido do seu carrinho.",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cartItems', JSON.stringify([]));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho.",
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return { label: 'Em Estoque', color: 'text-green-600' };
      case 'low_stock':
        return { label: 'Pouco Estoque', color: 'text-yellow-600' };
      case 'out_of_stock':
        return { label: 'Fora de Estoque', color: 'text-red-600' };
      default:
        return { label: 'Em Estoque', color: 'text-green-600' };
    }
  };

  const sendWhatsAppOrder = () => {
    const timestamp = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' –');

    const orderItems = cartItems.map(item => {
      const totalPrice = item.product_price * item.quantity;
      return `• Nome do Produto: ${item.product_name}\n• Quantidade: ${item.quantity}\n• Preço Unitário: R$ ${item.product_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• Total a Pagar: R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• Imagem do Produto: ${item.product_image}`;
    }).join('\n\n');

    const message = `⏱️ Pedido de Produto\n\n${orderItems}\n\n🕒 Gerado em: ${timestamp}\n\n📩 Mensagem:\nOlá! Gostei muito deste(s) produto(s) e tenho interesse em comprá-lo(s). Poderia me passar mais informações sobre pagamento, envio e disponibilidade?\n\nAguardo seu retorno. Obrigado(a)!`;
    
    const whatsappUrl = `https://wa.me/19999413755?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-neutral-900 mr-3" />
              <h1 className="text-4xl font-bold text-neutral-900">Meu Carrinho</h1>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Limpar Carrinho
              </button>
            )}
          </div>
          <p className="text-neutral-600 text-lg">
            {cartItems.length > 0 
              ? `${getTotalItems()} item${getTotalItems() !== 1 ? 's' : ''} no seu carrinho`
              : 'Seu carrinho está vazio'
            }
          </p>
        </motion.div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {cartItems.map((item, index) => {
                  const stockBadge = getStockBadge(item.stock_status || 'in_stock');
                  
                  return (
                    <motion.div
                      key={item.id}
                      className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product_image ? (
                            <img 
                              src={item.product_image} 
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <ShoppingCart size={24} />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-neutral-900 truncate">
                            {item.product_name}
                          </h3>
                          <p className="text-neutral-600 text-sm">{item.brand}</p>
                          {item.clone_category && (
                            <span className="inline-block mt-1 px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                              {item.clone_category}
                            </span>
                          )}
                          <p className={`text-sm font-medium mt-1 ${stockBadge.color}`}>
                            {stockBadge.label}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold text-lg min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-neutral-900">
                            R$ {(item.product_price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-neutral-500">
                            R$ {item.product_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} cada
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-neutral-50 rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} itens)</span>
                    <span>R$ {getTotalPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Frete</span>
                    <span>A calcular</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>R$ {getTotalPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={sendWhatsAppOrder}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={20} />
                  <span>Finalizar via WhatsApp</span>
                </button>

                <p className="text-xs text-neutral-500 text-center mt-3">
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
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="max-w-md mx-auto">
              <ShoppingCart className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Seu carrinho está vazio
              </h2>
              <p className="text-neutral-600 mb-8">
                Explore nossa coleção de relógios e adicione os produtos que mais gostar.
              </p>
              <Link
                to="/produtos"
                className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explorar Produtos
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
