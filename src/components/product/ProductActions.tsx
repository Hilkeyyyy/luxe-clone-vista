
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductActionsProps {
  isFavorite: boolean;
  isSoldOut: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  customBadge?: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  isFavorite,
  isSoldOut,
  onToggleFavorite,
  onAddToCart,
  customBadge,
}) => {
  return (
    <>
      {/* Favorite Button */}
      <motion.button
        onClick={onToggleFavorite}
        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors border border-neutral-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart
          size={16}
          className={`transition-colors ${
            isFavorite ? 'text-red-600 fill-red-600' : 'text-neutral-600 hover:text-red-600'
          }`}
        />
      </motion.button>

      {/* Add to Cart Button */}
      {!isSoldOut && (
        <motion.button 
          onClick={onAddToCart}
          className="p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart size={16} />
        </motion.button>
      )}
    </>
  );
};

export default ProductActions;
