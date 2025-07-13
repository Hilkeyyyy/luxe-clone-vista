
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
  description?: string;
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
            .eq('brand', category.name);
          
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
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBrandClick = (brand: BrandCategory) => {
    // CORREÇÃO CRÍTICA: Navegar com filtro exato por marca
    navigate(`/produtos?selectedCategory=${encodeURIComponent(brand.name)}`);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex space-x-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-none w-72 h-48 bg-neutral-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Controls */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => scroll('left')}
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* CORREÇÃO: Cards maiores e mais premium para as marcas */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((brand, index) => (
          <motion.button
            key={brand.id}
            onClick={() => handleBrandClick(brand)}
            className="group flex-none relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 border border-neutral-200/50 min-w-[320px] h-56"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Image with Gradient Overlay */}
            {brand.image_url && (
              <div className="absolute inset-0">
                <img 
                  src={brand.image_url} 
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30"></div>
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-8 text-center">
              <h3 className="text-2xl font-outfit font-bold text-white mb-3 group-hover:text-white/90 transition-colors tracking-wide">
                {brand.name}
              </h3>
              
              {brand.description && (
                <p className="text-white/80 mb-4 line-clamp-2 group-hover:text-white/70 transition-colors leading-relaxed">
                  {brand.description}
                </p>
              )}
              
              {/* Product Count Badge */}
              <div className="inline-flex items-center justify-center mx-auto px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium">
                {brand.products_count} {brand.products_count === 1 ? 'produto' : 'produtos'}
              </div>
            </div>

            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-500 to-neutral-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BrandCategoryCarousel;
