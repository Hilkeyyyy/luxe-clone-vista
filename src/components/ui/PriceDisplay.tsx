
import React from 'react';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  originalPrice, 
  size = 'md',
  className = '' 
}) => {
  const formatPrice = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {originalPrice && originalPrice > price && (
        <span className="text-xs text-neutral-400 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
      <span className={`${sizeClasses[size]} font-bold text-neutral-900`}>
        {formatPrice(price)}
      </span>
    </div>
  );
};

export default PriceDisplay;
