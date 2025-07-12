
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 overflow-hidden">
      {/* Background Elements - Glassmorphism */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-amber-100/30 to-rose-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge - Glassmorphism */}
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium text-neutral-700">
              Coleção Premium 2024
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-light text-neutral-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            RELÓGIOS DE
            <br />
            <span className="font-semibold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
              LUXO PREMIUM
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-neutral-600 font-light mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Descubra nossa coleção exclusiva de relógios premium. 
            Qualidade excepcional, design sofisticado e tradição relojoeira.
          </motion.p>

          {/* CTA Buttons - Flat Premium */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              onClick={() => navigate('/produtos')}
              className="group flex items-center space-x-2 px-8 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Explorar Coleção</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            <motion.button
              onClick={() => navigate('/products?destaque=true')}
              className="group flex items-center space-x-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-neutral-900 rounded-lg hover:bg-white transition-all duration-300 font-semibold border border-neutral-200 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backdropFilter: 'blur(10px)',
              }}
            >
              <span>Ver Destaques</span>
            </motion.button>
          </motion.div>

          {/* Features - Glassmorphism */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              {
                icon: Shield,
                title: "Garantia Premium",
                description: "12 meses de garantia completa"
              },
              {
                icon: Clock,
                title: "Entrega Rápida",
                description: "Envio em até 24h úteis"
              },
              {
                icon: Star,
                title: "Qualidade Superior",
                description: "Materiais premium certificados"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-lg bg-white/40 backdrop-blur-sm border border-white/30 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -2 }}
                style={{
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={20} className="text-neutral-700" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-neutral-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
