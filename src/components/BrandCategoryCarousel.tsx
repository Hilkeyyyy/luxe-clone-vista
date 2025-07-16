
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Brand {
  name: string;
  count: number;
  image?: string;
}

interface BrandCategoryCarouselProps {
  brands: Brand[];
}

const BrandCategoryCarousel: React.FC<BrandCategoryCarouselProps> = ({ brands }) => {
  const navigate = useNavigate();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBrandClick = (brandName: string) => {
    console.log('🔗 Navegando para marca:', brandName);
    const cleanBrandName = brandName.toLowerCase().trim();
    navigate(`/produtos?selectedCategory=${encodeURIComponent(cleanBrandName)}`);
  };

  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Nenhuma marca disponível</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
        <motion.button
          onClick={() => scroll('left')}
          className="p-4 rounded-full bg-white/95 shadow-xl hover:bg-white transition-all duration-300 text-neutral-800 hover:scale-110 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={24} />
        </motion.button>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
        <motion.button
          onClick={() => scroll('right')}
          className="p-4 rounded-full bg-white/95 shadow-xl hover:bg-white transition-all duration-300 text-neutral-800 hover:scale-110 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Carousel - Cards MUITO MAIORES para preencher melhor a landing page */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-8 pb-6 scrollbar-hide px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {brands.map((brand, index) => (
          <motion.button
            key={brand.name}
            onClick={() => handleBrandClick(brand.name)}
            className="group flex-shrink-0 w-96 h-80 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700">
              {brand.image ? (
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
              )}
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500" />

            {/* Content - Ajustado para cards maiores */}
            <div className="relative z-10 h-full flex flex-col justify-between p-10">
              {/* Brand Name */}
              <div className="text-left">
                <h3 className="text-5xl font-bold text-white mb-4 tracking-wide leading-tight">
                  {brand.name}
                </h3>
                <p className="text-white/80 text-xl font-light leading-relaxed">
                  Relógios premium de luxo
                </p>
              </div>

              {/* Product Count Badge - Maior e mais prominente */}
              <div className="self-start">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
                  <span className="text-white font-semibold text-xl">
                    {brand.count} produto{brand.count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover Effect Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BrandCategoryCarousel;
