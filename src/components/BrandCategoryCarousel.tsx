
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

  const handleBrandClick = (brandName: string) => {
    console.log('🔗 Navegando para marca:', brandName);
    const cleanBrandName = brandName.toLowerCase().trim();
    navigate(`/produtos?selectedCategory=${encodeURIComponent(cleanBrandName)}`);
  };

  // Debug das marcas recebidas
  React.useEffect(() => {
    console.log('🏷️ BrandCategoryCarousel recebeu marcas:', brands);
    console.log('📊 Total de marcas:', brands.length);
    brands.forEach(brand => {
      console.log(`   ${brand.name}: ${brand.count} produtos`);
    });
  }, [brands]);

  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Nenhuma marca disponível</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-8 pb-6 scrollbar-hide px-8"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {brands.map((brand, index) => (
          <motion.button
            key={brand.name}
            onClick={() => handleBrandClick(brand.name)}
            className="group flex-shrink-0 w-[450px] h-[320px] relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
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

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-10">
              {/* Brand Name */}
              <div className="text-left">
                <h3 className="text-4xl font-bold text-white mb-4 tracking-wide leading-tight">
                  {brand.name}
                </h3>
                <p className="text-white/80 text-lg font-light leading-relaxed">
                  Relógios premium de luxo
                </p>
              </div>

              {/* Product Count Badge - Contagem em TEMPO REAL corrigida */}
              <div className="self-start">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
                  <span className="text-white font-semibold text-lg">
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
