
import React from 'react';
import { Heart, ShoppingCart, CreditCard, Check } from 'lucide-react';
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
    <div className="flex flex-col space-y-2">
      {/* Botão Comprar - Apenas na página de produto */}
      {showBuyButton && !isSoldOut && (
        <motion.button
          onClick={onBuyNow}
          className="flex items-center justify-center space-x-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CreditCard size={16} />
          <span>COMPRAR VIA WHATSAPP</span>
        </motion.button>
      )}

      {/* Linha com Carrinho e Favoritos */}
      <div className="flex space-x-2">
        {/* Botão Adicionar ao Carrinho */}
        {!isSoldOut && (
          <motion.button 
            onClick={onAddToCart}
            disabled={isCartLoading}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors shadow-sm text-xs ${
              isCartAdded 
                ? 'bg-green-600 text-white' 
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            } ${isCartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isCartLoading ? 1 : 1.02 }}
            whileTap={{ scale: isCartLoading ? 1 : 0.98 }}
          >
            {isCartAdded ? (
              <>
                <Check size={14} />
                {showCartText && <span>Adicionado</span>}
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                {showCartText && <span>{isCartLoading ? 'Adicionando...' : 'Carrinho'}</span>}
              </>
            )}
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
