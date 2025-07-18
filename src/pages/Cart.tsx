import React, { useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartHeader from '@/components/cart/CartHeader';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSecureCart } from '@/hooks/useSecureCart';
import { useAuth } from '@/hooks/useAuth';
import EmptyState from '@/components/ui/EmptyState';

const Cart = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { 
    cartItems, 
    loading: cartLoading, 
    initialized,
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalPrice, 
    getTotalItems,
  } = useSecureCart();

  // Memoizar função WhatsApp para evitar re-renders
  const handleWhatsAppOrder = useMemo(() => {
    return () => {
      let message = `🛒 Pedido do Carrinho\n\n`;

      cartItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        
        message += `🧾 Produto: ${item.name}\n`;
        message += `📦 Quantidade: ${item.quantity}x\n`;
        message += `💸 Valor unitário: R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        
        if (item.images && item.images.length > 0) {
          message += `🖼️ Imagem do produto:\n${item.images[0]}\n`;
        }
        
        if (index < cartItems.length - 1) {
          message += `\n`;
        }
      });
      
      const total = getTotalPrice;
      message += `\n💰 Total do Pedido: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      
      const whatsappUrl = `https://wa.me/5519999413755?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };
  }, [cartItems, getTotalPrice]);

  // Componente de loading otimizado
  const OptimizedLoading = React.memo(() => (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      <LoadingSpinner />
      <Footer />
    </div>
  ));

  // Loading states otimizados
  if (authLoading || !initialized) {
    return <OptimizedLoading />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <EmptyState
          icon={ShoppingBag}
          title="Faça login para ver seu carrinho"
          description="Entre na sua conta para acessar seus produtos salvos no carrinho."
          action={{
            label: "Fazer Login",
            onClick: () => window.location.href = '/login'
          }}
        />
        <Footer />
      </div>
    );
  }

  if (cartLoading) {
    return <OptimizedLoading />;
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader itemCount={getTotalItems} />

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <CartItem
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                  {...item}
                  index={index}
                  onUpdateQuantity={(productId, quantity) => updateQuantity(item.id, quantity)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            <CartSummary
              totalItems={getTotalItems}
              totalPrice={getTotalPrice}
              onCheckout={handleWhatsAppOrder}
              onClear={clearCart}
            />
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
