
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductImage from '@/components/product/ProductImage';
import ProductActions from '@/components/product/ProductActions';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useProductActions } from '@/hooks/useProductActions';
import { useAuthActions } from '@/hooks/useAuthActions';
import AuthModal from '@/components/auth/AuthModal';

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
}) => {
  const { toggleFavorite, addToCart, buyNow, isFavorite } = useProductActions();
  const { showAuthModal, authMode, closeAuthModal } = useAuthActions();

  const numericPrice = parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
  const numericOriginalPrice = originalPrice ? parseFloat(originalPrice.replace(/[^\d,]/g, '').replace(',', '.')) : undefined;

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
    buyNow(id, name);
  };

  return (
    <>
      <motion.div
        className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -4 }}
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
            customBadge={custom_badge} // CORREÇÃO: Garantir que customBadge seja passado
          />

          <div className="p-4">
            <div className="mb-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                {brand}
              </p>
              <h3 className="font-semibold text-neutral-900 line-clamp-2 leading-snug">
                {name}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <PriceDisplay 
                price={numericPrice}
                originalPrice={numericOriginalPrice}
              />
            </div>

            {stock_status && stock_status !== 'in_stock' && (
              <div className="mt-2">
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

        {/* Botões de ação sempre visíveis no mobile e no hover no desktop - SEM botão COMPRAR */}
        <div className="absolute bottom-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
          <ProductActions
            isFavorite={isFavorite(id)}
            isSoldOut={!!is_sold_out}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            customBadge={custom_badge}
            showBuyButton={false} // Na landing page, não mostra o botão COMPRAR
            showCartText={true} // No card, mostra texto do carrinho
          />
        </div>
      </motion.div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        mode={authMode}
        onSuccess={closeAuthModal}
      />
    </>
  );
};

export default ProductCard;
