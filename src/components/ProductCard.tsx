
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductImage from '@/components/product/ProductImage';
import ProductActions from '@/components/product/ProductActions';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useProductActions } from '@/hooks/useProductActions';

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
  const { toggleFavorite, addToCart, isFavorite, isInCart } = useProductActions();

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
    
    const whatsappNumber = "19999413755";
    const storeUrl = window.location.origin;
    const productUrl = `${storeUrl}/products/${id}`;
    
    let message = `🛒 *INTERESSE EM PRODUTO*\n\n`;
    message += `📋 *PRODUTO SELECIONADO:*\n\n`;
    message += `🏷️ *${name}*\n`;
    message += `   • Marca: ${brand}\n`;
    message += `   • Preço: R$ ${numericPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    message += `   • Link: ${productUrl}\n`;
    if (image) message += `   • Imagem: ${image}\n\n`;
    message += `📞 Gostaria de mais informações sobre este produto!\n`;
    message += `Formas de pagamento e entrega disponíveis?`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      className="group relative rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)"
      }}
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

      {/* Botões de ação SEMPRE visíveis com glassmorphism */}
      <div className="absolute bottom-4 right-4 opacity-100 transition-all duration-300">
        <ProductActions
          isFavorite={isFavorite(id)}
          isSoldOut={!!is_sold_out}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          customBadge={custom_badge}
          showBuyButton={false}
          showCartText={false}
          isCartLoading={false}
          isCartAdded={isInCart(id)}
          productId={id}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;
