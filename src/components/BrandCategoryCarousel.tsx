
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
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-neutral-200 rounded w-32 mb-6"></div>
            <div className="flex space-x-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-none w-56 h-20 bg-neutral-200 rounded-lg"></div>
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
      className="py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Flat Premium */}
        <div className="flex items-center justify-between mb-6">
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-outfit font-light text-neutral-900 mb-1 tracking-wide">
              EXPLORAR CATEGORIAS
            </h2>
            <p className="text-neutral-600 font-light text-sm">
              Navegue por nossa coleção de marcas premium
            </p>
          </motion.div>
          
          {/* Navigation Controls - Flat */}
          <div className="hidden sm:flex items-center space-x-2">
            <motion.button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* Categories Carousel - Flat Premium */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group flex-none relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200 p-4 min-w-[240px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="relative z-10">
                {category.image_url && (
                  <div className="w-full h-12 mb-3 rounded-md overflow-hidden">
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="text-left">
                  <h3 className="font-outfit font-semibold text-base text-neutral-900 mb-1 group-hover:text-neutral-700 transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Contador de Produtos */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-600 group-hover:text-neutral-700 transition-colors">
                      {category.products_count} {category.products_count === 1 ? 'produto' : 'produtos'}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-700 group-hover:bg-neutral-200 transition-colors">
                      {category.products_count}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mobile scroll indicators - Flat */}
        <div className="flex justify-center mt-4 sm:hidden">
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-lg bg-white text-neutral-600 hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-white text-neutral-600 hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-sm"
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
