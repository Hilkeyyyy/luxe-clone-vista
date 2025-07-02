
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

const ProductCarousel = ({ title, products }: ProductCarouselProps) => {
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
          <h2 className="text-2xl sm:text-3xl font-outfit font-semibold text-neutral-900">
            {title}
          </h2>
          <div className="hidden sm:flex items-center space-x-2">
            <motion.button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-neutral-600 hover:text-neutral-900"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-neutral-600 hover:text-neutral-900"
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
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex-none w-72 sm:w-80"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
                  <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center">
                    <span className="text-neutral-500 font-outfit font-medium">IMG</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-outfit font-semibold text-lg text-neutral-900 mb-1 group-hover:text-neutral-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-neutral-600 font-outfit text-sm mb-3">
                    {product.brand}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-outfit font-bold text-neutral-900">
                      {product.price}
                    </span>
                    <motion.button
                      className="px-4 py-2 bg-neutral-900 text-white rounded-xl font-outfit font-medium text-sm hover:bg-neutral-800 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ver Detalhes
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ProductCarousel;
