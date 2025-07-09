
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
    console.log('🔗 Navegando para categoria:', category.slug);
    navigate(`/brand/${category.slug}`);
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
        {/* CORREÇÃO 9: Título mais elegante */}
        <h2 className="text-3xl font-light text-neutral-900 font-outfit tracking-wide">
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
                whileHover={{ y: -2 }}
                onClick={() => handleCategoryClick(category)}
              >
                {/* CORREÇÃO 9: Design mais elegante e limpo */}
                <div className="relative w-full h-80 bg-neutral-50 rounded-none overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 border border-neutral-100">
                  {/* Background Image */}
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-4xl font-light text-neutral-400 font-outfit">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Overlay - mais sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-light text-white mb-2 font-outfit tracking-wide">
                        {category.name}
                      </h3>
                      
                      {/* CORREÇÃO 4: Contador de produtos em todas as categorias */}
                      {category.products_count > 0 && (
                        <p className="text-white/80 mb-4 text-sm font-outfit font-light">
                          {category.products_count} produtos disponíveis
                        </p>
                      )}

                      {/* CORREÇÃO 9: Botão mais elegante */}
                      <motion.button
                        className="bg-white text-neutral-900 px-6 py-2 rounded-none font-light text-sm font-outfit hover:bg-neutral-100 transition-colors shadow-sm border border-white"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(category);
                        }}
                      >
                        EXPLORAR
                      </motion.button>
                    </div>
                  </div>

                  {/* Badge - CORREÇÃO 4: Contador sempre visível */}
                  {category.products_count > 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-neutral-900 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        {category.products_count}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* CORREÇÃO 9: Navegação mais elegante */}
        <CarouselPrevious className="hidden sm:flex -left-12 w-10 h-10 border border-neutral-300 hover:border-neutral-400 bg-white/95 hover:bg-white shadow-sm rounded-none" />
        <CarouselNext className="hidden sm:flex -right-12 w-10 h-10 border border-neutral-300 hover:border-neutral-400 bg-white/95 hover:bg-white shadow-sm rounded-none" />
      </Carousel>
    </div>
  );
};

export default BrandCategoryCarousel;
