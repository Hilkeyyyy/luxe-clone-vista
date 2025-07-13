
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Star } from 'lucide-react';

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
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Star className="w-4 h-4 mr-2 text-blue-600" />
              Relógios Premium Certificados
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Excelência em{' '}
              <span className="text-blue-600">
                Relógios Premium
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
                className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explorar Coleção
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={() => document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-900 rounded-lg font-semibold hover:bg-neutral-50 transition-all duration-300 hover:scale-105"
              >
                Ver Destaques
              </button>
            </motion.div>
          </motion.div>

          {/* Featured Watch Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 p-8 shadow-lg">
              <div className="aspect-square bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Clock className="w-32 h-32 text-neutral-400" />
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Disponível
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
