
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

  const brandCards = [
    {
      name: 'Rolex',
      image: '/placeholder.svg',
      description: 'Luxo e precisão suíça'
    },
    {
      name: 'Patek Philippe',
      image: '/placeholder.svg',
      description: 'Alta relojoaria'
    },
    {
      name: 'Omega',
      image: '/placeholder.svg',
      description: 'Precisão espacial'
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
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
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 font-outfit leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Relógios de
                <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Luxo
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-neutral-300 mb-8 leading-relaxed font-outfit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Descubra nossa coleção exclusiva de relógios de alta qualidade. 
                Precisão, elegância e sofisticação em cada detalhe.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg font-outfit hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-2xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExploreProducts}
                >
                  Explorar Coleção
                </motion.button>

                <motion.button
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg font-outfit hover:bg-white hover:text-neutral-900 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExploreBrand('Rolex')}
                >
                  Ver Rolex
                </motion.button>
              </motion.div>

              {/* Brand Cards */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {brandCards.map((brand, index) => (
                  <motion.div
                    key={brand.name}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => handleExploreBrand(brand.name)}
                  >
                    <div className="text-center">
                      <h3 className="text-white font-semibold font-outfit mb-2 text-lg">
                        {brand.name}
                      </h3>
                      <p className="text-neutral-300 text-sm font-outfit mb-4">
                        {brand.description}
                      </p>
                      <motion.button
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full font-semibold text-sm font-outfit hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExploreBrand(brand.name);
                        }}
                      >
                        CONFIRA
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default HeroSection;
