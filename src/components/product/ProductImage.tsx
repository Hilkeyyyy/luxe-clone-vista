
import React from 'react';
import ProductBadges from './ProductBadges';

interface ProductImageProps {
  image: string;
  name: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isSoldOut?: boolean;
  originalPrice?: number;
  price: number;
  cloneCategory?: string;
  customBadge?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  image,
  name,
  isNew,
  isFeatured,
  isBestseller,
  isSoldOut,
  originalPrice,
  price,
  cloneCategory,
  customBadge,
}) => {
  return (
    <div className="relative aspect-square overflow-hidden bg-neutral-50">
      <img
        src={image || '/placeholder.svg'}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      
      <ProductBadges
        isNew={isNew}
        isFeatured={isFeatured}
        isBestseller={isBestseller}
        isSoldOut={isSoldOut}
        originalPrice={originalPrice}
        price={price}
        cloneCategory={cloneCategory}
        customBadge={customBadge}
      />
    </div>
  );
};

export default ProductImage;
