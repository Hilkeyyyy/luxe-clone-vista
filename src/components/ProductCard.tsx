
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductImage from '@/components/product/ProductImage';
import ProductActions from '@/components/product/ProductActions';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useSecureProductActions } from '@/hooks/useSecureProductActions';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  clone_category?: string;
  stock_status?: string;
  is_sold_out?: boolean;
  custom_badge?: string;
  is_bestseller?: boolean;
  is_featured?: boolean;
  isNew?: boolean;
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
  clone_category,
  stock_status,
  is_sold_out,
  custom_badge,
  is_bestseller,
  is_featured,
  isNew,
  delay = 0,
  simplified = false,
}) => {
  const { toggleFavorite, addToCart, buySpecificProduct, isFavorite, getButtonState } = useSecureProductActions();

  const numericPrice = parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
  const numericOriginalPrice = originalPrice ? parseFloat(originalPrice.replace(/[^\d,]/g, '').replace(',', '.')) : undefined;

  const buttonState = getButtonState(id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id, name);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, name);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    buySpecificProduct(id, name, brand, numericPrice, image);
  };

  return (
    <motion.div
      className="group relative rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-200 bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -2 }}
    >
      <Link to={`/products/${id}`}>
        <ProductImage
          image={image}
          name={name}
          isNew={isNew}
          isFeatured={is_featured}
          isBestseller={is_bestseller}
          isSoldOut={is_sold_out}
          originalPrice={numericOriginalPrice}
          price={numericPrice}
          cloneCategory={clone_category}
          customBadge={custom_badge}
          simplified={simplified}
        />

        <div className="p-4">
          <div className="mb-3">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
              {brand}
            </p>
            <h3 className="font-semibold text-neutral-900 line-clamp-2 leading-snug mb-2">
              {name}
            </h3>
          </div>

          <div className="flex items-center justify-between mb-3">
            <PriceDisplay 
              price={numericPrice}
              originalPrice={numericOriginalPrice}
            />
          </div>

          {stock_status && stock_status !== 'in_stock' && (
            <div className="mb-3">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  stock_status === 'low_stock'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {stock_status === 'low_stock' ? 'Pouco Estoque' : 'Fora de Estoque'}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Botões de ação sempre visíveis - Flat Premium */}
      <div className="absolute bottom-4 right-4 opacity-100 transition-opacity duration-300">
        <ProductActions
          isFavorite={isFavorite(id)}
          isSoldOut={!!is_sold_out}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          customBadge={custom_badge}
          showBuyButton={false}
          showCartText={false}
          isCartLoading={buttonState.isLoading}
          isCartAdded={buttonState.isSuccess}
          productId={id}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;
