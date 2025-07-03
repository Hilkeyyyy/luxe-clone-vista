
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  is_new: boolean;
  clone_category?: string;
}

interface FeaturedProductsGridProps {
  products: Product[];
  loading: boolean;
}

const FeaturedProductsGrid: React.FC<FeaturedProductsGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-neutral-900 mb-4">
              DESTAQUES
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Os relógios mais procurados da nossa coleção
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className="py-12 sm:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-neutral-900 mb-4">
            DESTAQUES
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Os relógios mais procurados da nossa coleção
          </p>
        </motion.div>

        {/* Products Grid - Vertical Layout */}
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
                isNew={product.is_new}
                clone_category={product.clone_category}
                delay={0}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedProductsGrid;
