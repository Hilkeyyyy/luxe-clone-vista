
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
    <div className="flex flex-col space-y-4">
      {/* Botão Comprar via WhatsApp - DESIGN GLASSMORPHISM ELEGANTE */}
      {showBuyButton && !isSoldOut && (
        <motion.button
          onClick={onBuyNow}
          className="group relative overflow-hidden flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500/90 to-emerald-600/90 text-white px-8 py-4 rounded-2xl font-outfit font-semibold text-sm shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border border-white/20"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.25)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Liquid Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <MessageCircle size={20} className="relative z-10" />
          <span className="relative z-10">COMPRAR VIA WHATSAPP</span>
        </motion.button>
      )}

      {/* Linha com Carrinho e Favoritos - DESIGN GLASSMORPHISM */}
      <div className="flex space-x-3">
        {/* Botão Adicionar ao Carrinho */}
        {!isSoldOut && (
          <motion.button 
            onClick={onAddToCart}
            disabled={isCartLoading}
            className={`group relative overflow-hidden flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl transition-all duration-500 font-outfit font-semibold text-sm shadow-lg hover:shadow-xl backdrop-blur-sm border ${
              isCartAdded 
                ? 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 text-white border-white/20 shadow-green-500/25' 
                : 'bg-gradient-to-r from-neutral-900/90 to-neutral-800/90 text-white hover:from-neutral-800/90 hover:to-neutral-700/90 border-white/10'
            } ${isCartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ 
              scale: isCartLoading ? 1 : 1.02,
              boxShadow: isCartAdded 
                ? "0 20px 40px -12px rgba(34, 197, 94, 0.3)" 
                : "0 20px 40px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: isCartLoading ? 1 : 0.98 }}
          >
            {/* Liquid Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            {isCartAdded ? (
              <>
                <Check size={18} className="relative z-10" />
                {showCartText && <span className="relative z-10">Adicionado!</span>}
              </>
            ) : (
              <>
                <ShoppingCart size={18} className="relative z-10" />
                {showCartText && <span className="relative z-10">{isCartLoading ? 'Adicionando...' : 'Carrinho'}</span>}
              </>
            )}
          </motion.button>
        )}

        {/* Botão Favoritar - DESIGN GLASSMORPHISM ELEGANTE */}
        <motion.button
          onClick={onToggleFavorite}
          className={`group relative overflow-hidden flex items-center justify-center px-4 py-3.5 rounded-2xl transition-all duration-500 shadow-lg hover:shadow-xl backdrop-blur-sm border-2 ${
            isFavorite 
              ? 'bg-gradient-to-r from-red-50/90 to-pink-50/90 border-red-300/50 text-red-600 hover:shadow-red-500/20' 
              : 'bg-white/80 border-neutral-200/50 text-neutral-600 hover:border-red-300/50 hover:bg-red-50/80 hover:text-red-600 hover:shadow-red-500/10'
          }`}
          whileHover={{ 
            scale: 1.05,
            rotate: isFavorite ? 0 : 5
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Liquid Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <Heart
            size={18}
            className={`relative z-10 transition-all duration-300 ${
              isFavorite ? 'text-red-600 fill-red-600' : 'text-neutral-600'
            }`}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default ProductActions;
