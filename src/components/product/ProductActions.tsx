
import React from 'react';
import { Heart, ShoppingCart, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductActionsProps {
  isFavorite: boolean;
  isSoldOut: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  onBuyNow: (e: React.MouseEvent) => void;
  customBadge?: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  isFavorite,
  isSoldOut,
  onToggleFavorite,
  onAddToCart,
  onBuyNow,
  customBadge,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {/* Botão Comprar - Principal */}
      {!isSoldOut && (
        <motion.button
          onClick={onBuyNow}
          className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CreditCard size={16} />
          <span>COMPRAR</span>
        </motion.button>
      )}

      <div className="flex space-x-2">
        {/* Botão Adicionar ao Carrinho */}
        {!isSoldOut && (
          <motion.button 
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center space-x-1 bg-neutral-900 text-white px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart size={14} />
            <span>Carrinho</span>
          </motion.button>
        )}

        {/* Botão Favoritar */}
        <motion.button
          onClick={onToggleFavorite}
          className="flex items-center justify-center bg-white/90 backdrop-blur-sm border border-neutral-200 px-3 py-2 rounded-lg hover:bg-white transition-colors shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Heart
            size={14}
            className={`transition-colors ${
              isFavorite ? 'text-red-600 fill-red-600' : 'text-neutral-600 hover:text-red-600'
            }`}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default ProductActions;
