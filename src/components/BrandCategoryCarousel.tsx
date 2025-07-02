
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';

interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  order_position: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  is_new: boolean;
  clone_category?: string;
}

interface BrandCategoryCarouselProps {
  category: BrandCategory;
}

const BrandCategoryCarousel = ({ category }: BrandCategoryCarouselProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchCategoryProducts();
  }, [category.id]);

  const fetchCategoryProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('brand_category_id', category.id)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos da categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, products.length - 3)) % Math.max(1, products.length - 3));
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-2xl animate-pulse" />
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      {/* Category Header with Background Image */}
      <div 
        className="relative h-64 rounded-2xl overflow-hidden mb-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${category.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-between p-8">
          <div className="text-white max-w-md">
            <motion.h2 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {category.name}
            </motion.h2>
            <motion.p 
              className="text-lg opacity-90 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {category.description}
            </motion.p>
            <motion.button
              className="bg-white text-neutral-900 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CONFIRA
            </motion.button>
          </div>
        </div>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-neutral-900">
            Produtos {category.name}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              disabled={products.length <= 4}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              disabled={products.length <= 4}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <motion.div 
            className="flex gap-6"
            animate={{ x: `-${currentIndex * 25}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {products.map((product) => (
              <div key={product.id} className="min-w-[calc(25%-18px)]">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  originalPrice={product.original_price 
                    ? `R$ ${product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                    : undefined}
                  image={product.images[0]}
                  isNew={product.is_new}
                  clone_category={product.clone_category}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandCategoryCarousel;
