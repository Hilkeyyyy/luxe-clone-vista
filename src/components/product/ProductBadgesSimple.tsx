
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
      'ETA Base': 'ETA BASE',
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
          <Badge className="text-xs font-medium px-2 py-1 bg-slate-600/90 text-white backdrop-blur-sm border-0 shadow-sm">
            {getCloneCategoryDisplay(cloneCategory)}
          </Badge>
        </div>
      )}

      {/* Custom Badge - Top Right */}
      {customBadge && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="text-xs font-medium px-2 py-1 bg-violet-600/90 text-white backdrop-blur-sm border-0 shadow-sm">
            {customBadge.toUpperCase()}
          </Badge>
        </div>
      )}

      {/* Stock Status - Bottom Left (only if sold out) */}
      {isSoldOut && (
        <div className="absolute bottom-2 left-2 z-10">
          <Badge className="text-xs font-medium px-2 py-1 bg-neutral-600/90 text-white backdrop-blur-sm border-0 shadow-sm">
            ESGOTADO
          </Badge>
        </div>
      )}
    </>
  );
};

export default ProductBadgesSimple;
