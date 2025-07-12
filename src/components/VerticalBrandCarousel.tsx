
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

const VerticalBrandCarousel = () => {
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
            .or(`brand.ilike.%${category.name}%,clone_category.eq.${category.name}`);
          
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
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBrandClick = (brand: BrandCategory) => {
    navigate(`/produtos?marca=${encodeURIComponent(brand.name)}`);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex space-x-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-none w-80 h-40 bg-neutral-200 rounded-lg"></div>
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
      {/* Navigation Controls - Flat Premium */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => scroll('left')}
            className="p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            className="p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 text-neutral-600 hover:text-neutral-900 border border-neutral-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Brands Carousel - Flat Premium */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
      >
        {categories.map((brand, index) => (
          <motion.button
            key={brand.id}
            onClick={() => handleBrandClick(brand)}
            className="group flex-none relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-200 min-w-[320px] h-40"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Background Image with Glassmorphism Overlay */}
            {brand.image_url && (
              <div className="absolute inset-0">
                <img 
                  src={brand.image_url} 
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
              </div>
            )}
            
            {/* Content Overlay - Glassmorphism */}
            <div className="relative z-10 h-full flex flex-col justify-center p-6">
              <div className="mb-2">
                <h3 className="text-2xl font-outfit font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                  {brand.name}
                </h3>
                
                {brand.description && (
                  <p className="text-sm text-white/80 mb-3 line-clamp-2 group-hover:text-white/70 transition-colors">
                    {brand.description}
                  </p>
                )}
                
                {/* Product Count Badge - Glassmorphism */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium">
                  {brand.products_count} {brand.products_count === 1 ? 'produto' : 'produtos'}
                </div>
              </div>
            </div>

            {/* Hover Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default VerticalBrandCarousel;
