import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-64" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <Skeleton className="h-3 w-16" />
        
        {/* Product Name */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;