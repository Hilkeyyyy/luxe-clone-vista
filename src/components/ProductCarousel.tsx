
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

interface ProductCarouselProps {
  title: string;
  products: Product[];
  loading?: boolean;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, loading = false }) => {
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
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-neutral-900 mb-4">
              {title}
            </h2>
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
        <div className="flex items-center justify-between mb-8">
          <motion.div 
            className="text-center sm:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-neutral-900 mb-2">
              {title}
            </h2>
            <p className="text-neutral-600">
              {title === 'NOVIDADES' && 'Os lançamentos mais recentes da nossa coleção'}
              {title === 'OFERTAS' && 'Descontos especiais por tempo limitado'}
            </p>
          </motion.div>
          
          <div className="hidden sm:flex items-center space-x-2">
            <motion.button
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex-none w-72 sm:w-80"
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
                isNew={product.is_new}
                clone_category={product.clone_category}
                delay={0}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll indicators */}
        <div className="flex justify-center mt-6 sm:hidden">
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
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
