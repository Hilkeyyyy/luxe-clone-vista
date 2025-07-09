
import React from 'react';
import { Heart, ShoppingCart, MessageCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductActionsProps {
  isFavorite: boolean;
  isSoldOut: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  onBuyNow: (e: React.MouseEvent) => void;
  customBadge?: string;
  showBuyButton?: boolean;
  showCartText?: boolean;
  isCartLoading?: boolean;
  isCartAdded?: boolean;
  productId?: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  isFavorite,
  isSoldOut,
  onToggleFavorite,
  onAddToCart,
  onBuyNow,
  customBadge,
  showBuyButton = false,
  showCartText = true,
  isCartLoading = false,
  isCartAdded = false,
  productId = '',
}) => {
  return (
    <div className="flex flex-col space-y-3">
      {/* Botão Comprar via WhatsApp - DESIGN ELEGANTE */}
      {showBuyButton && !isSoldOut && (
        <motion.button
          onClick={onBuyNow}
          className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3.5 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg font-outfit font-semibold text-sm transform hover:scale-[1.02]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle size={18} />
          <span>COMPRAR VIA WHATSAPP</span>
        </motion.button>
      )}

      {/* Linha com Carrinho e Favoritos - DESIGN MELHORADO */}
      <div className="flex space-x-3">
        {/* Botão Adicionar ao Carrinho */}
        {!isSoldOut && (
          <motion.button 
            onClick={onAddToCart}
            disabled={isCartLoading}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl transition-all duration-300 shadow-md font-outfit font-semibold text-sm ${
              isCartAdded 
                ? 'bg-green-600 text-white transform scale-[1.02]' 
                : 'bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-[1.02]'
            } ${isCartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isCartLoading ? 1 : 1.02 }}
            whileTap={{ scale: isCartLoading ? 1 : 0.98 }}
          >
            {isCartAdded ? (
              <>
                <Check size={16} />
                {showCartText && <span>Adicionado!</span>}
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {showCartText && <span>{isCartLoading ? 'Adicionando...' : 'Carrinho'}</span>}
              </>
            )}
          </motion.button>
        )}

        {/* Botão Favoritar - DESIGN ELEGANTE */}
        <motion.button
          onClick={onToggleFavorite}
          className={`flex items-center justify-center px-4 py-3 rounded-2xl border-2 transition-all duration-300 shadow-md ${
            isFavorite 
              ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
              : 'bg-white border-neutral-200 text-neutral-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              isFavorite ? 'text-red-600 fill-red-600' : 'text-neutral-600'
            }`}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default ProductActions;
