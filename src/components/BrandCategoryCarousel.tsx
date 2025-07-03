
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBrandCategories } from '@/hooks/useBrandCategories';
import { Button } from '@/components/ui/button';

const BrandCategoryCarousel = () => {
  const { categories, loading } = useBrandCategories(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (category: any) => {
    navigate(`/produtos?marca=${encodeURIComponent(category.name)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 font-outfit">
          Marcas em Destaque
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            className="p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            className="p-2 rounded-full"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="flex-shrink-0 w-80 h-96 group cursor-pointer"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="relative w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
              {/* Background Image */}
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                  <span className="text-6xl font-bold text-neutral-400 font-outfit">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 font-outfit">
                    {category.name}
                  </h3>
                  
                  {category.products_count > 0 && (
                    <p className="text-white/80 mb-4 font-outfit">
                      {category.products_count} produtos disponíveis
                    </p>
                  )}

                  <motion.button
                    className="bg-white text-neutral-900 px-8 py-3 rounded-full font-semibold font-outfit hover:bg-neutral-100 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category);
                    }}
                  >
                    CONFIRA
                  </motion.button>
                </div>
              </div>

              {/* Badge */}
              {category.products_count > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {category.products_count}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BrandCategoryCarousel;
