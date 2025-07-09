
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VerticalBrandCarousel from './VerticalBrandCarousel';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreProducts = () => {
    navigate('/produtos');
  };

  const handleExploreBrand = (brand: string) => {
    navigate(`/produtos?marca=${encodeURIComponent(brand)}`);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 overflow-hidden">
      {/* Background Pattern - CORREÇÃO 9: Design mais elegante */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* CORREÇÃO 9: Tipografia mais elegante e refinada */}
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-light text-neutral-900 mb-6 font-outfit leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Relógios de
                <span className="block font-normal text-neutral-800">
                  Luxo
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-neutral-600 mb-8 leading-relaxed font-outfit font-light tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Descubra nossa coleção exclusiva de relógios de alta qualidade. 
                Precisão, elegância e sofisticação em cada detalhe.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {/* CORREÇÃO 9: Botões mais elegantes e refinados */}
                <motion.button
                  className="bg-neutral-900 text-white px-8 py-4 rounded-none font-light text-lg font-outfit hover:bg-neutral-800 transition-all duration-300 shadow-sm border border-neutral-900"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExploreProducts}
                >
                  Explorar Coleção
                </motion.button>

                <motion.button
                  className="border border-neutral-300 text-neutral-800 px-8 py-4 rounded-none font-light text-lg font-outfit hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExploreBrand('Rolex')}
                >
                  Ver Rolex
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Vertical Carousel */}
        <div className="hidden lg:block w-1/3 relative">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <VerticalBrandCarousel />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient - CORREÇÃO 9: Mais sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent" />
    </section>
  );
};

export default HeroSection;
