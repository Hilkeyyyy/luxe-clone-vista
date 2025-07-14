
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-6 min-w-max px-4">
        {brands.map((brand, index) => (
          <motion.button
            key={brand.name}
            onClick={() => handleBrandClick(brand.name)}
            className="group flex-shrink-0 w-48 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Imagem da marca */}
            <div className="h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center relative overflow-hidden">
              {brand.image ? (
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-neutral-700">
                    {brand.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Informações da marca */}
            <div className="p-4 text-center">
              <h3 className="font-bold text-lg text-black mb-1 group-hover:text-neutral-700 transition-colors">
                {brand.name}
              </h3>
              <p className="text-sm text-neutral-500 mb-3">
                {brand.count} {brand.count === 1 ? 'produto' : 'produtos'}
              </p>
              <div className="flex items-center justify-center">
                <ChevronRight 
                  size={16} 
                  className="text-neutral-400 group-hover:text-black transition-colors"
                />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BrandCategoryCarousel;
