
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBrandCategories } from '@/hooks/useBrandCategories';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  order_position: number;
  is_active: boolean;
  products_count: number;
}

const BrandCategoryCarousel: React.FC = () => {
  const { categories, loading } = useBrandCategories(true);
  const navigate = useNavigate();

  const handleCategoryClick = (category: BrandCategory) => {
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
    <div className="px-4 sm:px-6 lg:px-8 mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 font-outfit">
          Marcas em Destaque
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category, index) => (
            <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <motion.div
                className="group cursor-pointer h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="relative w-full h-80 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  {/* Background Image */}
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                      <span className="text-5xl font-bold text-neutral-400 font-outfit">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                        {category.name}
                      </h3>
                      
                      {category.products_count > 0 && (
                        <p className="text-white/80 mb-4 text-sm font-outfit">
                          {category.products_count} produtos disponíveis
                        </p>
                      )}

                      <motion.button
                        className="bg-white text-neutral-900 px-6 py-2 rounded-full font-semibold text-sm font-outfit hover:bg-neutral-100 transition-colors shadow-md"
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
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {category.products_count}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="hidden sm:flex -left-12 w-10 h-10 border-2 border-neutral-300 hover:border-neutral-400 bg-white/90 hover:bg-white shadow-md" />
        <CarouselNext className="hidden sm:flex -right-12 w-10 h-10 border-2 border-neutral-300 hover:border-neutral-400 bg-white/90 hover:bg-white shadow-md" />
      </Carousel>
    </div>
  );
};

export default BrandCategoryCarousel;
