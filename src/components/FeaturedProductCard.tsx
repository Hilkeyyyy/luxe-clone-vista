
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProductBadges from '@/components/product/ProductBadges';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useOptimizedProductActions } from '@/hooks/useOptimizedProductActions';
import { Heart, ShoppingBag, Phone } from 'lucide-react';

interface FeaturedProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  isNew?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_sold_out?: boolean;
  clone_category?: string;
  stock_status?: string;
  custom_badge?: string;
  delay?: number;
}

const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  isNew = false,
  is_featured = false,
  is_bestseller = false,
  is_sold_out = false,
  clone_category,
  stock_status = 'in_stock',
  custom_badge,
  delay = 0,
}) => {
  const navigate = useNavigate();
  const { 
    toggleFavorite, 
    addToCart, 
    buySpecificProduct, 
    isFavorite, 
    getButtonState 
  } = useOptimizedProductActions();
  
  const buttonState = getButtonState(id);

  const handleClick = () => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(id, name, 1);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(id, name);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const numericPrice = parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
    await buySpecificProduct(id, name, brand, numericPrice, image);
  };

  // Converter preços string para number
  const numericPrice = parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
  const numericOriginalPrice = originalPrice ? parseFloat(originalPrice.replace(/[^\d,]/g, '').replace(',', '.')) : undefined;

  const isInStock = stock_status === 'in_stock' && !is_sold_out;
  const isOutOfStock = stock_status === 'out_of_stock' || is_sold_out;

  return (
    <motion.div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-100/50 hover:border-neutral-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-neutral-50 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        <ProductBadges
          isNew={isNew}
          isFeatured={is_featured}
          isBestseller={is_bestseller}
          isSoldOut={is_sold_out}
          originalPrice={numericOriginalPrice}
          price={numericPrice}
          cloneCategory={clone_category}
          customBadge={custom_badge}
        />

        {/* Stock Status */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Esgotado
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <motion.button
          onClick={handleToggleFavorite}
          disabled={buttonState.isFavoriteLoading}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorite(id)
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-500'
          } ${buttonState.isFavoriteLoading ? 'animate-pulse' : ''}`}
          whileHover={{ scale: buttonState.isFavoriteLoading ? 1 : 1.1 }}
          whileTap={{ scale: buttonState.isFavoriteLoading ? 1 : 0.9 }}
        >
          {buttonState.isFavoriteLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Heart className="w-4 h-4" fill={isFavorite(id) ? 'currentColor' : 'none'} />
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-sm text-neutral-500 mb-1 font-medium">{brand}</p>
        
        {/* Name */}
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 leading-snug">
          {name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <PriceDisplay
            price={numericPrice}
            originalPrice={numericOriginalPrice}
            size="sm"
          />
        </div>

        {/* Action Buttons - COM BOTÃO DE TELEFONE para carrosséis especiais */}
        <div className="flex gap-2">
          <motion.button
            onClick={handleAddToCart}
            disabled={isOutOfStock || buttonState.isCartLoading}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : buttonState.isCartAdded
                ? 'bg-green-500 text-white shadow-md'
                : buttonState.isCartLoading
                ? 'bg-neutral-300 text-neutral-600 animate-pulse'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm hover:shadow-md'
            }`}
            whileHover={!isOutOfStock && !buttonState.isCartLoading ? { scale: 1.02, y: -1 } : {}}
            whileTap={!isOutOfStock && !buttonState.isCartLoading ? { scale: 0.98 } : {}}
          >
            {buttonState.isCartLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Adicionando...
              </div>
            ) : buttonState.isCartAdded ? (
              <div className="flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Adicionado!
              </div>
            ) : isOutOfStock ? (
              'Indisponível'
            ) : (
              <div className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Adicionar
              </div>
            )}
          </motion.button>
          
          {/* Botão de WhatsApp - SEMPRE presente nos carrosséis especiais */}
          {!isOutOfStock && (
            <motion.button
              onClick={handleBuyNow}
              className="px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedProductCard;
