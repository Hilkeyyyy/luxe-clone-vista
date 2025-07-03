
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string;
}

const VerticalBrandCarousel = () => {
  const [categories, setCategories] = useState<BrandCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
      }, 4000); // Muda a cada 4 segundos

      return () => clearInterval(interval);
    }
  }, [categories.length]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true })
        .limit(6); // Limite de 6 categorias no carrossel

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  if (loading || categories.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Título do Carrossel */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-neutral-900 mb-2">Marcas Premium</h3>
        <p className="text-neutral-600 text-sm">Descubra nossa seleção exclusiva</p>
      </div>

      {/* Container do Carrossel */}
      <div className="relative bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
        {/* Controles */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <button
            onClick={prevSlide}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ChevronUp size={16} className="text-neutral-700" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ChevronDown size={16} className="text-neutral-700" />
          </button>
        </div>

        {/* Slides */}
        <div className="h-80 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div 
                className="w-full h-full relative"
                style={{
                  backgroundImage: categories[currentIndex]?.image_url 
                    ? `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${categories[currentIndex].image_url})`
                    : 'linear-gradient(135deg, #1f2937, #374151)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                  <motion.h4 
                    className="text-2xl font-bold text-white mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {categories[currentIndex]?.name}
                  </motion.h4>
                  
                  {categories[currentIndex]?.description && (
                    <motion.p 
                      className="text-white/90 text-sm max-w-xs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {categories[currentIndex].description}
                    </motion.p>
                  )}

                  <motion.button
                    className="mt-4 px-6 py-2 bg-white text-neutral-900 rounded-lg font-semibold text-sm hover:bg-neutral-100 transition-colors"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    EXPLORAR
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lista de Marcas Abaixo */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {categories.slice(0, 4).map((category, index) => (
          <motion.div
            key={category.id}
            className={`p-3 rounded-lg border transition-colors cursor-pointer ${
              index === currentIndex 
                ? 'bg-neutral-900 text-white border-neutral-900' 
                : 'bg-white border-neutral-200 hover:border-neutral-300'
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <h5 className="font-semibold text-sm">{category.name}</h5>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VerticalBrandCarousel;
