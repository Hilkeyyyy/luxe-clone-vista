
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Brand {
  name: string;
  count: number;
}

interface BrandCategoryCarouselProps {
  brands: Brand[];
}

const BrandCategoryCarousel: React.FC<BrandCategoryCarouselProps> = ({ brands }) => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName: string) => {
    console.log('🔗 Navegando para marca:', brandName);
    // CORREÇÃO CRÍTICA: Navegação correta para filtrar por marca específica
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
    <section id="featured-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-black mb-4">
            Marcas em Destaque
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Explore nossa seleção das melhores marcas de relógios premium
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <motion.button
              key={brand.name}
              onClick={() => handleBrandClick(brand.name)}
              className="group relative bg-white border-2 border-neutral-200 rounded-xl p-6 hover:border-black hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <h3 className="font-bold text-lg text-black mb-2 group-hover:text-neutral-700 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm text-neutral-500 mb-3">
                  {brand.count} {brand.count === 1 ? 'produto' : 'produtos'}
                </p>
                <ChevronRight 
                  size={16} 
                  className="mx-auto text-neutral-400 group-hover:text-black transition-colors"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandCategoryCarousel;
