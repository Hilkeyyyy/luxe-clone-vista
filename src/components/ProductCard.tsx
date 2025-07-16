
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProductBadges from '@/components/product/ProductBadges';
import ProductActions from '@/components/product/ProductActions';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useOptimizedProductActions } from '@/hooks/useOptimizedProductActions';

interface ProductCardProps {
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
  simplified?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
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
  simplified = false,
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

  // Converter preços string para number para ProductBadges
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
        <div className="absolute top-3 left-3 flex flex-col gap-1">
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
        </div>

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
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorite(id)
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-500'
          } ${buttonState.isFavoriteLoading ? 'animate-pulse' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={buttonState.isFavoriteLoading}
        >
          <svg className="w-4 h-4" fill={isFavorite(id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
          </svg>
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
            price={price}
            originalPrice={originalPrice}
            size="sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={handleAddToCart}
            disabled={isOutOfStock || buttonState.isCartLoading}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : buttonState.isCartAdded
                ? 'bg-green-500 text-white'
                : buttonState.isCartLoading
                ? 'bg-neutral-300 text-neutral-600 animate-pulse'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
            whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
          >
            {buttonState.isCartLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Adicionando...
              </div>
            ) : buttonState.isCartAdded ? (
              '✅ Adicionado!'
            ) : isOutOfStock ? (
              'Indisponível'
            ) : (
              'Adicionar'
            )}
          </motion.button>
          
          <motion.button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
            whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
          >
            💬
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
