
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductBadgesSimpleProps {
  isSoldOut?: boolean;
  cloneCategory?: string;
  customBadge?: string;
}

const ProductBadgesSimple: React.FC<ProductBadgesSimpleProps> = ({
  isSoldOut,
  cloneCategory,
  customBadge,
}) => {
  const getCloneCategoryDisplay = (category?: string) => {
    if (!category) return null;
    
    const categoryMap: { [key: string]: string } = {
      'BASE ETA': 'BASE ETA',
      'ETA Base': 'BASE ETA',
      'Clone': 'CLONE',
      'Super Clone': 'SUPER CLONE'
    };
    
    return categoryMap[category] || category.toUpperCase();
  };

  return (
    <>
      {/* Clone Category - Top Left */}
      {cloneCategory && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="text-xs font-medium px-2 py-1 bg-sky-600 text-white border-0 shadow-sm">
            {getCloneCategoryDisplay(cloneCategory)}
          </Badge>
        </div>
      )}

      {/* Custom Badge - Top Right */}
      {customBadge && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="text-xs font-medium px-2 py-1 bg-slate-600 text-white border-0 shadow-sm">
            {customBadge.toUpperCase()}
          </Badge>
        </div>
      )}

      {/* CORREÇÃO 6: Stock Status - Bottom Left (ESGOTADO) */}
      {isSoldOut && (
        <div className="absolute bottom-2 left-2 z-10">
          <Badge className="text-xs font-medium px-2 py-1 bg-neutral-600 text-white border-0 shadow-sm">
            ESGOTADO
          </Badge>
        </div>
      )}
    </>
  );
};

export default ProductBadgesSimple;
