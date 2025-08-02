
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHeroSettings } from '@/hooks/useHeroSettings';

const HeroSection = () => {
  const { heroSettings, loading } = useHeroSettings();

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
        </div>
      </section>
    );
  }

  const backgroundStyle = heroSettings.backgroundImage 
    ? { 
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${heroSettings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  return (
    <section className="relative overflow-hidden bg-white" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          {/* Title - PURE BLACK TEXT */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {heroSettings.title}
          </motion.h1>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
