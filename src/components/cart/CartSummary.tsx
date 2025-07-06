
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useProductFormatting } from '@/hooks/useProductFormatting';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  onCheckout: () => void;
  onClear: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalItems,
  totalPrice,
  onCheckout,
  onClear,
}) => {
  const { formatPrice, formatItemCount } = useProductFormatting();

  return (
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
            <span>Subtotal ({formatItemCount(totalItems)})</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Frete</span>
            <span className="text-green-600">A calcular</span>
          </div>
          <div className="border-t border-neutral-200 pt-3">
            <div className="flex justify-between text-lg font-bold text-neutral-900">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onCheckout}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            Finalizar no WhatsApp
          </Button>
          
          <Button
            onClick={onClear}
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
  );
};

export default CartSummary;
