
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartHeader from '@/components/cart/CartHeader';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useAuthActions } from '@/hooks/useAuthActions';
import AuthModal from '@/components/auth/AuthModal';
import EmptyState from '@/components/ui/EmptyState';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const { showAuthModal, authMode, closeAuthModal } = useAuthActions();
  const { 
    cartItems, 
    loading, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalPrice, 
    getTotalItems,
    refetch 
  } = useCart();

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
        <EmptyState
          icon={ShoppingBag}
          title="Faça login para ver seu carrinho"
          description="Entre na sua conta para acessar seus produtos salvos no carrinho."
          action={{
            label: "Fazer Login",
            onClick: () => {}
          }}
        />
        <Footer />
        <AuthModal
          isOpen={showAuthModal}
          onClose={closeAuthModal}
          mode="login"
          onSuccess={() => {
            closeAuthModal();
            refetch();
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader itemCount={getTotalItems()} />

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id}
                  {...item}
                  index={index}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <CartSummary
              totalItems={getTotalItems()}
              totalPrice={getTotalPrice()}
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
