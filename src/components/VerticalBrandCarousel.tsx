
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Brand {
  name: string;
  count: number;
}

interface VerticalBrandCarouselProps {
  brands: Brand[];
}

const VerticalBrandCarousel: React.FC<VerticalBrandCarouselProps> = ({ brands }) => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName: string) => {
    console.log('🔗 Clicado na marca:', brandName);
    // CORREÇÃO CRÍTICA: Navegação correta para filtrar por marca específica
    const cleanBrandName = brandName.toLowerCase().trim();
    navigate(`/produtos?selectedCategory=${encodeURIComponent(cleanBrandName)}`);
  };

  if (!brands || brands.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-xl font-bold text-black mb-6">Marcas Populares</h3>
        <div className="text-center py-8">
          <p className="text-neutral-500">Nenhuma marca disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-black mb-6">Marcas Populares</h3>
      
      <div className="space-y-3">
        {brands.map((brand, index) => (
          <motion.button
            key={brand.name}
            onClick={() => handleBrandClick(brand.name)}
            className="group w-full flex items-center justify-between p-4 bg-white border-2 border-neutral-200 rounded-lg hover:border-black hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold text-black group-hover:text-neutral-700 transition-colors">
                {brand.name}
              </span>
              <span className="text-sm text-neutral-500">
                {brand.count} {brand.count === 1 ? 'produto' : 'produtos'}
              </span>
            </div>
            
            <ChevronRight 
              size={18} 
              className="text-neutral-400 group-hover:text-black transition-colors"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default VerticalBrandCarousel;
