
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';
import { ProductDisplay } from '@/types/product';

interface FeaturedProductsGridProps {
  products: ProductDisplay[];
  loading: boolean;
}

const FeaturedProductsGrid: React.FC<FeaturedProductsGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Nenhum produto em destaque encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <ProductCard
            id={product.id}
            name={product.name}
            brand={product.brand}
            price={`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            originalPrice={product.original_price 
              ? `R$ ${product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
              : undefined}
            image={product.images[0]}
            isNew={product.is_new || false}
            is_featured={product.is_featured || false}
            is_sold_out={product.is_sold_out || false}
            clone_category={product.clone_category}
            stock_status={product.stock_status}
            custom_badge={product.custom_badge}
            delay={0}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedProductsGrid;
