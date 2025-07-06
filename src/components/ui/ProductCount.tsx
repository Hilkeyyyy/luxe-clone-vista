
import React from 'react';
import { useProductFormatting } from '@/hooks/useProductFormatting';

interface ProductCountProps {
  count: number;
  type?: 'products' | 'items';
  className?: string;
}

const ProductCount: React.FC<ProductCountProps> = ({ count, type = 'products', className = '' }) => {
  const { formatProductCount, formatItemCount } = useProductFormatting();
  
  const text = type === 'products' ? formatProductCount(count) : formatItemCount(count);
  
  return (
    <span className={`text-neutral-600 ${className}`}>
      {text} encontrado{count !== 1 ? 's' : ''}
    </span>
  );
};

export default ProductCount;
