
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductFormatting } from '@/hooks/useProductFormatting';

interface CartHeaderProps {
  itemCount: number;
}

const CartHeader: React.FC<CartHeaderProps> = ({ itemCount }) => {
  const { formatItemCount } = useProductFormatting();

  return (
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
      
      {itemCount > 0 && (
        <p className="text-neutral-600">
          {formatItemCount(itemCount)} no carrinho
        </p>
      )}
    </motion.div>
  );
};

export default CartHeader;
