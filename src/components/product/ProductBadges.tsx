
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductBadgesProps {
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isSoldOut?: boolean;
  originalPrice?: number;
  price: number;
  cloneCategory?: string;
  customBadge?: string;
}

const ProductBadges: React.FC<ProductBadgesProps> = ({
  isNew,
  isFeatured,
  isBestseller,
  isSoldOut,
  originalPrice,
  price,
  cloneCategory,
  customBadge,
}) => {
  const getBadgeVariant = (type: string) => {
    const variants = {
      custom: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500 shadow-lg',
      new: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-lg',
      featured: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-500 shadow-lg',
      bestseller: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-lg',
      discount: 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-500 shadow-lg',
      soldout: 'bg-gradient-to-r from-neutral-500 to-neutral-600 text-white border-neutral-400 shadow-lg',
      clone: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 shadow-lg'
    };
    return variants[type as keyof typeof variants] || variants.custom;
  };

  const getCloneCategoryDisplay = (category?: string) => {
    if (!category) return null;
    
    const categoryMap: { [key: string]: string } = {
      'ETA Base': 'ETA BASE',
      'Clone': 'CLONE',
      'Super Clone': 'SUPER CLONE'
    };
    
    return categoryMap[category] || category.toUpperCase();
  };

  return (
    <>
      {/* Badges - Left Side */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        {isNew && (
          <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('new')}`}>
            NOVO
          </Badge>
        )}
        {isFeatured && (
          <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('featured')}`}>
            DESTAQUE
          </Badge>
        )}
        {isBestseller && (
          <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('bestseller')}`}>
            MAIS VENDIDO
          </Badge>
        )}
        {originalPrice && originalPrice > price && (
          <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('discount')}`}>
            PROMOÇÃO
          </Badge>
        )}
        {isSoldOut && (
          <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('soldout')}`}>
            ESGOTADO
          </Badge>
        )}
        {cloneCategory && (
          <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('clone')}`}>
            {getCloneCategoryDisplay(cloneCategory)}
          </Badge>
        )}
      </div>

      {/* Custom Badge - Top Right */}
      {customBadge && (
        <div className="absolute top-3 right-3">
          <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('custom')} animate-pulse`}>
            {customBadge.toUpperCase()}
          </Badge>
        </div>
      )}
    </>
  );
};

export default ProductBadges;
