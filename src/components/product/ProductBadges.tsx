
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
    // CORREÇÃO 9: Cores neutras e elegantes (sem gradientes)
    const variants = {
      custom: 'bg-slate-800 text-white border-slate-600 shadow-sm',
      new: 'bg-emerald-600 text-white border-emerald-500 shadow-sm',
      bestseller: 'bg-blue-600 text-white border-blue-500 shadow-sm',
      discount: 'bg-red-600 text-white border-red-500 shadow-sm',
      soldout: 'bg-neutral-600 text-white border-neutral-500 shadow-sm',
      clone: 'bg-sky-600 text-white border-sky-500 shadow-sm'
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

  // Calcular porcentagem real de desconto
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
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('new')}`}>
            NOVO
          </Badge>
        )}
        {/* CORREÇÃO 7: Remover tag visual "DESTAQUE" - produto destaque aparece só na seção de destaques */}
        {isBestseller && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('bestseller')}`}>
            MAIS VENDIDO
          </Badge>
        )}
        {originalPrice && originalPrice > price && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('discount')}`}>
            {getDiscountPercentage()}
          </Badge>
        )}
        {/* CORREÇÃO 6: Tag "ESGOTADO" em todas as páginas */}
        {isSoldOut && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('soldout')}`}>
            ESGOTADO
          </Badge>
        )}
        {cloneCategory && (
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('clone')}`}>
            {getCloneCategoryDisplay(cloneCategory)}
          </Badge>
        )}
      </div>

      {/* Custom Badge - Top Right */}
      {customBadge && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className={`text-xs font-bold px-3 py-1.5 ${getBadgeVariant('custom')}`}>
            {customBadge.toUpperCase()}
          </Badge>
        </div>
      )}
    </>
  );
};

export default ProductBadges;
