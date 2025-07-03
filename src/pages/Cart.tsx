
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, MessageCircle, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

    let message = "*INTERESSE DE COMPRA*\n\nOlá! Tenho interesse neste produto:\n\n";
    
    cartItems.forEach((item, index) => {
      message += `*Produto:* ${item.product_name}\n`;
      message += `*Marca:* ${item.brand || 'N/A'}\n`;
      message += `*Preço:* R$ ${item.product_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
      message += `*Categoria:* ${item.clone_category || 'N/A'}\n`;
      message += `*Link da Imagem:* ${item.product_image}\n\n`;
    });

    const now = new Date();
    const dataConsulta = now.toLocaleDateString('pt-BR');
    const horaConsulta = now.toLocaleTimeString('pt-BR');

    message += `📅*Data da Consulta:* ${dataConsulta} às ${horaConsulta}\n\n`;
    message += "💬 *Mensagem:* Gostaria de mais informações sobre este relógio e condições de compra.\n\n";
    message += "Aguardo seu contato! 🙏";

    const whatsappUrl = `https://wa.me/5586988388124?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cartItems', JSON.stringify([]));
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Lista limpa",
      description: "Todos os itens foram removidos.",
    });
  };

  const total = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-neutral-50 font-outfit">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:bg-neutral-100"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </Button>
            <div className="h-6 w-px bg-neutral-300" />
            <h1 className="text-2xl font-bold text-neutral-900">Lista de Interesse</h1>
          </div>
          
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Limpar Lista
            </Button>
          )}
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={32} className="text-neutral-400" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Sua lista está vazia
            </h2>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Adicione produtos à sua lista de interesse para entrar em contato via WhatsApp
            </p>
            <Button onClick={() => navigate('/')} className="bg-neutral-900 hover:bg-neutral-800">
              Explorar Produtos
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Lista de Produtos */}
            <motion.div 
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      {/* Imagem do Produto */}
                      <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      
                      {/* Informações do Produto */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-neutral-900 truncate">
                          {item.product_name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          {item.brand && (
                            <span className="text-neutral-600 text-sm">{item.brand}</span>
                          )}
                          {item.clone_category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                              {item.clone_category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-600">
                          {item.selected_color && (
                            <span>Cor: {item.selected_color}</span>
                          )}
                          {item.selected_size && (
                            <span>Tamanho: {item.selected_size}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Quantidade e Preço */}
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 p-0"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-lg text-neutral-900">
                            R$ {(item.product_price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-neutral-600">
                              R$ {item.product_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} cada
                            </p>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Resumo e WhatsApp */}
            <motion.div 
              className="sticky bottom-0 bg-white border-t border-neutral-200 p-6 -mx-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg">
                    <span className="text-neutral-600">Total de Interesse:</span>
                    <span className="font-bold text-xl text-neutral-900 ml-2">
                      R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
                  </div>
                </div>
                
                <Button
                  onClick={generateWhatsAppMessage}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-medium"
                  size="lg"
                >
                  <MessageCircle size={24} className="mr-2" />
                  Enviar Lista via WhatsApp
                </Button>
                
                <p className="text-center text-sm text-neutral-600 mt-3">
                  Você será redirecionado para o WhatsApp com sua lista formatada
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
