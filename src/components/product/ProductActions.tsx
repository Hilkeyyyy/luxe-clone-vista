
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
      {/* Botão Comprar via WhatsApp - GLASSMORPHISM PREMIUM */}
      {showBuyButton && !isSoldOut && (
        <motion.button
          onClick={onBuyNow}
          className="group relative overflow-hidden flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-outfit font-semibold text-sm shadow-xl hover:shadow-2xl transition-all duration-500 text-white"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 12px 40px rgba(34, 197, 94, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Liquid Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <MessageCircle size={20} className="relative z-10" />
          <span className="relative z-10">COMPRAR VIA WHATSAPP</span>
        </motion.button>
      )}

      {/* Linha com Carrinho e Favoritos - GLASSMORPHISM PREMIUM */}
      <div className="flex space-x-3">
        {/* Botão Adicionar ao Carrinho */}
        {!isSoldOut && (
          <motion.button 
            onClick={onAddToCart}
            disabled={isCartLoading}
            className={`group relative overflow-hidden flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl transition-all duration-500 font-outfit font-semibold text-sm shadow-lg hover:shadow-xl ${
              isCartAdded 
                ? 'text-white' 
                : 'text-white hover:text-white'
            } ${isCartLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{
              background: isCartAdded 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(23, 23, 23, 0.9) 0%, rgba(38, 38, 38, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: isCartAdded 
                ? '0 8px 32px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                : '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
            whileHover={{ 
              scale: isCartLoading ? 1 : 1.02,
              boxShadow: isCartAdded 
                ? "0 12px 40px rgba(34, 197, 94, 0.4)" 
                : "0 12px 40px rgba(0, 0, 0, 0.3)"
            }}
            whileTap={{ scale: isCartLoading ? 1 : 0.98 }}
          >
            {/* Liquid Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

        {/* Botão Favoritar - GLASSMORPHISM PREMIUM */}
        <motion.button
          onClick={onToggleFavorite}
          className={`group relative overflow-hidden flex items-center justify-center px-4 py-3.5 rounded-2xl transition-all duration-500 shadow-lg hover:shadow-xl ${
            isFavorite 
              ? 'text-red-600' 
              : 'text-neutral-600 hover:text-red-600'
          }`}
          style={{
            background: isFavorite 
              ? 'linear-gradient(135deg, rgba(254, 226, 226, 0.9) 0%, rgba(252, 165, 165, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 250, 251, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: isFavorite 
              ? '1px solid rgba(239, 68, 68, 0.3)'
              : '1px solid rgba(229, 231, 235, 0.5)',
            boxShadow: isFavorite 
              ? '0 8px 32px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
          whileHover={{ 
            scale: 1.05,
            rotate: isFavorite ? 0 : 5,
            boxShadow: isFavorite 
              ? "0 12px 40px rgba(239, 68, 68, 0.3)" 
              : "0 12px 40px rgba(239, 68, 68, 0.15)"
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
