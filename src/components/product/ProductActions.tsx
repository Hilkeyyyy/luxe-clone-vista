
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
      {/* Botão Comprar via WhatsApp - Flat Premium */}
      {showBuyButton && !isSoldOut && (
        <motion.button
          onClick={onBuyNow}
          className="group relative flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 text-white bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
        >
          <MessageCircle size={18} />
          <span>COMPRAR VIA WHATSAPP</span>
        </motion.button>
      )}

      {/* Linha com Carrinho e Favoritos - Flat Premium */}
      <div className="flex space-x-2">
        {/* Botão Adicionar ao Carrinho */}
        {!isSoldOut && (
          <motion.button 
            onClick={onAddToCart}
            disabled={isCartLoading}
            className={`group flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm shadow-sm hover:shadow-md ${
              isCartAdded 
                ? 'text-white bg-green-600 hover:bg-green-700' 
                : 'text-white bg-neutral-900 hover:bg-neutral-800'
            } ${isCartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isCartLoading ? 1 : 1.01, y: isCartLoading ? 0 : -1 }}
            whileTap={{ scale: isCartLoading ? 1 : 0.99 }}
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

        {/* Botão Favoritar - Flat Premium */}
        <motion.button
          onClick={onToggleFavorite}
          className={`group flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
            isFavorite 
              ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200' 
              : 'text-neutral-600 bg-white hover:bg-neutral-50 border border-neutral-200 hover:text-red-600'
          }`}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              isFavorite ? 'text-red-600 fill-red-600' : 'text-neutral-600 group-hover:text-red-600'
            }`}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default ProductActions;
