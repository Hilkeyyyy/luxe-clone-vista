
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  products_count: number;
  is_active: boolean;
}

const BrandCategoryCarousel = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;

      // Contar produtos para cada categoria
      const categoriesWithCount = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('clone_category', category.name);
          
          return {
            ...category,
            products_count: count || 0
          };
        })
      );

      setCategories(categoriesWithCount.filter(cat => cat.products_count > 0));
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (category: BrandCategory) => {
    navigate(`/produtos?categoria=${encodeURIComponent(category.name)}`);
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-8"></div>
            <div className="flex space-x-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-none w-64 h-32 bg-neutral-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className="py-12 sm:py-16 bg-gradient-to-b from-white via-neutral-50/30 to-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div 
            className="text-center sm:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-outfit font-light text-neutral-900 mb-2 tracking-wide">
              CATEGORIAS
            </h2>
            <p className="text-neutral-600 font-light">
              Explore nossa coleção por marcas
            </p>
          </motion.div>
          
          {/* Navigation Controls */}
          <div className="hidden sm:flex items-center space-x-2">
            <motion.button
              onClick={() => scroll('left')}
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        {/* Categories Carousel */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group flex-none relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-200/50 p-6 min-w-[280px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                y: -4
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Liquid Glass Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <div className="relative z-10">
                {category.image_url && (
                  <div className="w-full h-20 mb-4 rounded-xl overflow-hidden">
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                
                <div className="text-left">
                  <h3 className="font-outfit font-semibold text-lg text-neutral-900 mb-2 group-hover:text-neutral-800 transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Contador de Produtos */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 group-hover:text-neutral-700 transition-colors">
                      {category.products_count} {category.products_count === 1 ? 'produto' : 'produtos'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-700 group-hover:from-neutral-200 group-hover:to-neutral-300 transition-all duration-300">
                      {category.products_count}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mobile scroll indicators */}
        <div className="flex justify-center mt-6 sm:hidden">
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-neutral-100/80 transition-colors border border-neutral-200/50 shadow-md"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-neutral-100/80 transition-colors border border-neutral-200/50 shadow-md"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BrandCategoryCarousel;
