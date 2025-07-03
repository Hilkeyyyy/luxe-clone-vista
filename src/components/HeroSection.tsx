
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
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
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
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 font-outfit leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Relógios de
                <span className="block text-neutral-900">
                  Luxo
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-neutral-600 mb-8 leading-relaxed font-outfit"
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
                <motion.button
                  className="bg-neutral-900 text-white px-8 py-4 rounded-full font-semibold text-lg font-outfit hover:bg-neutral-800 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExploreProducts}
                >
                  Explorar Coleção
                </motion.button>

                <motion.button
                  className="border-2 border-neutral-900 text-neutral-900 px-8 py-4 rounded-full font-semibold text-lg font-outfit hover:bg-neutral-900 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
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

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
