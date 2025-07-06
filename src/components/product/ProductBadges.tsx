
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
    // MELHORIA: Cores mais elegantes e sofisticadas
    const variants = {
      custom: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white border-violet-400 shadow-lg backdrop-blur-sm',
      new: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white border-emerald-400 shadow-lg backdrop-blur-sm',
      featured: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white border-amber-400 shadow-lg backdrop-blur-sm',
      bestseller: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white border-blue-400 shadow-lg backdrop-blur-sm',
      discount: 'bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 text-white border-rose-400 shadow-lg backdrop-blur-sm',
      soldout: 'bg-gradient-to-br from-slate-500 via-gray-500 to-neutral-600 text-white border-slate-400 shadow-lg backdrop-blur-sm',
      clone: 'bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white border-sky-400 shadow-lg backdrop-blur-sm'
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

  // CORREÇÃO: Calcular porcentagem real de desconto
  const getDiscountPercentage = () => {
    if (!originalPrice || originalPrice <= price) return null;
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return `-${discount}%`;
  };

  return (
    <>
      {/* Badges - Left Side */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        {isNew && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('new')} ring-1 ring-white/20`}>
            NOVO
          </Badge>
        )}
        {isFeatured && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('featured')} ring-1 ring-white/20`}>
            DESTAQUE
          </Badge>
        )}
        {isBestseller && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('bestseller')} ring-1 ring-white/20`}>
            MAIS VENDIDO
          </Badge>
        )}
        {/* CORREÇÃO: Mostrar porcentagem real em vez de "PROMOÇÃO" */}
        {originalPrice && originalPrice > price && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('discount')} ring-1 ring-white/20`}>
            {getDiscountPercentage()}
          </Badge>
        )}
        {isSoldOut && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('soldout')} ring-1 ring-white/20`}>
            ESGOTADO
          </Badge>
        )}
        {cloneCategory && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('clone')} ring-1 ring-white/20`}>
            {getCloneCategoryDisplay(cloneCategory)}
          </Badge>
        )}
      </div>

      {/* Custom Badge - Top Right */}
      {customBadge && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('custom')} animate-pulse ring-1 ring-white/20`}>
            {customBadge.toUpperCase()}
          </Badge>
        </div>
      )}
    </>
  );
};

export default ProductBadges;
