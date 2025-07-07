import React from 'react';
import ProductSkeleton from '@/components/ui/ProductSkeleton';

interface CarouselSkeletonProps {
  title?: string;
}

const CarouselSkeleton: React.FC<CarouselSkeletonProps> = ({ title }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-12">
      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 font-outfit">
          {title}
        </h2>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CarouselSkeleton;