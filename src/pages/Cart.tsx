
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, MessageCircle, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  brand?: string;
  clone_category?: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Produto removido",
      description: "Item removido da sua lista de interesse.",
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return;

    let message = "🕰️ *INTERESSE DE COMPRA*\n\nOlá! Tenho interesse nestes produtos:\n\n";
    
    cartItems.forEach((item, index) => {
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `${index + 1}. *${item.product_name}*\n`;
      message += `💰 *Preço:* R$ ${item.product_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
      if (item.brand) message += `🏷️ *Marca:* ${item.brand}\n`;
      if (item.clone_category) message += `⭐ *Categoria:* ${item.clone_category}\n`;
      message += `📦 *Quantidade:* ${item.quantity}\n`;
      if (item.selected_color) message += `🎨 *Cor:* ${item.selected_color}\n`;
      if (item.selected_size) message += `📏 *Tamanho:* ${item.selected_size}\n\n`;
    });

    const total = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    message += `💰 *Total:* R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;
    message += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}\n\n`;
    message += "Gostaria de mais informações sobre estes produtos!\n\nAguardo seu contato! 🙂";

    const whatsappUrl = `https://wa.me/5586988388124?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cartItems', JSON.stringify([]));
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos.",
    });
  };

  const total = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <h1 className="text-3xl font-bold text-neutral-900">Lista de Interesse</h1>
          </div>
          
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              Limpar tudo
            </button>
          )}
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingCart size={64} className="mx-auto text-neutral-300 mb-4" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Sua lista está vazia
            </h2>
            <p className="text-neutral-600 mb-8">
              Adicione produtos à sua lista de interesse para entrar em contato via WhatsApp
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
            >
              Ver Produtos
            </button>
          </motion.div>
        ) : (
          <>
            {/* Cart Items */}
            <motion.div 
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {cartItems.map((item, index) => (
                <div key={item.id} className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-neutral-900">{item.product_name}</h3>
                      {item.brand && <p className="text-neutral-600">{item.brand}</p>}
                      {item.clone_category && (
                        <span className="inline-block bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium mt-1">
                          {item.clone_category}
                        </span>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        {item.selected_color && (
                          <span className="text-sm text-neutral-600">Cor: {item.selected_color}</span>
                        )}
                        {item.selected_size && (
                          <span className="text-sm text-neutral-600">Tamanho: {item.selected_size}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-lg text-neutral-900">
                          R$ {(item.product_price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-neutral-600">
                          R$ {item.product_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} cada
                        </p>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Summary */}
            <motion.div 
              className="bg-neutral-50 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-neutral-900">Total de Interesse:</span>
                <span className="text-2xl font-bold text-neutral-900">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <button
                onClick={generateWhatsAppMessage}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-colors font-medium text-lg"
              >
                <MessageCircle size={24} />
                <span>Enviar Lista via WhatsApp</span>
              </button>
              
              <p className="text-center text-sm text-neutral-600 mt-3">
                Você será redirecionado para o WhatsApp com sua lista de interesse pré-formatada
              </p>
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
