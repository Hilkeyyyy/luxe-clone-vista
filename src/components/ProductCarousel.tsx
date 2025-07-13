
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import CarouselSkeleton from '@/components/ui/CarouselSkeleton';
import { ProductDisplay } from '@/types/product';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: ProductDisplay[];
  loading?: boolean;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, subtitle, products, loading = false }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return <CarouselSkeleton title={title} />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className="py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Flat Premium */}
        <div className="flex items-center justify-between mb-6">
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-outfit font-light text-neutral-900 mb-1 tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-neutral-600 font-light text-sm">
                {subtitle}
              </p>
            )}
          </motion.div>
          
          {/* Navigation - Flat Premium */}
          <div className="hidden sm:flex items-center space-x-2">
            <motion.button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex-none w-72"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
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
                clone_category={product.clone_category}
                is_sold_out={product.is_sold_out}
                delay={0}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll indicators - Flat */}
        <div className="flex justify-center mt-4 sm:hidden">
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-lg bg-white text-neutral-600 hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-white text-neutral-600 hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductCarousel;
