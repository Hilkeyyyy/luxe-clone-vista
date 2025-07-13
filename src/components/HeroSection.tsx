
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              RELÓGIOS PREMIUM E COM{' '}
              <span className="text-black">
                QUALIDADE
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-neutral-600 mb-8 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Descubra nossa coleção exclusiva de relógios das marcas mais prestigiadas do mundo. 
              Tradição, qualidade e design sofisticado em cada peça.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                to="/produtos"
                className="group inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explorar Coleção
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={() => document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-black text-black rounded-lg font-semibold hover:bg-neutral-50 transition-all duration-300 hover:scale-105"
              >
                Ver Destaques
              </button>
            </motion.div>
          </motion.div>

          {/* Featured Watch Image - Simplified */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-neutral-200 p-8 shadow-lg">
              <div className="aspect-square bg-neutral-50 rounded-xl flex items-center justify-center">
                <div className="w-32 h-32 bg-neutral-300 rounded-full flex items-center justify-center">
                  <span className="text-neutral-600 font-bold text-lg">RELÓGIO</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
