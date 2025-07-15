
import React from 'react';
import { Heart, ShoppingCart, MessageCircle, Check, Loader2 } from 'lucide-react';
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
  isFavoriteLoading?: boolean;
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
  isFavoriteLoading = false,
  productId = '',
}) => {
  return (
    <div className="flex flex-col space-y-3">
      {/* Botão Comprar via WhatsApp */}
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

      {/* Linha com Carrinho e Favoritos - FUNCIONAL E RESPONSIVO */}
      <div className="flex space-x-2">
        {/* Botão Adicionar ao Carrinho - FEEDBACK INSTANTÂNEO */}
        {!isSoldOut && (
          <motion.button 
            onClick={onAddToCart}
            disabled={isCartLoading}
            className={`group flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md ${
              isCartAdded 
                ? 'text-white bg-green-600 hover:bg-green-700' 
                : 'text-white bg-neutral-900 hover:bg-neutral-800'
            } ${isCartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isCartLoading ? 1 : 1.02, y: isCartLoading ? 0 : -1 }}
            whileTap={{ scale: isCartLoading ? 1 : 0.98 }}
          >
            {isCartLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {showCartText && <span>Adicionando...</span>}
              </>
            ) : isCartAdded ? (
              <>
                <Check size={16} />
                {showCartText && <span>Adicionado!</span>}
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {showCartText && <span>Carrinho</span>}
              </>
            )}
          </motion.button>
        )}

        {/* Botão Favoritar - FEEDBACK INSTANTÂNEO */}
        <motion.button
          onClick={onToggleFavorite}
          disabled={isFavoriteLoading}
          className={`group flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
            isFavorite 
              ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200' 
              : 'text-neutral-600 bg-white hover:bg-neutral-50 border border-neutral-200 hover:text-red-600'
          } ${isFavoriteLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          whileHover={{ scale: isFavoriteLoading ? 1 : 1.05, y: isFavoriteLoading ? 0 : -1 }}
          whileTap={{ scale: isFavoriteLoading ? 1 : 0.95 }}
        >
          {isFavoriteLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Heart
              size={16}
              className={`transition-all duration-200 ${
                isFavorite ? 'text-red-600 fill-red-600' : 'text-neutral-600 group-hover:text-red-600'
              }`}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ProductActions;
