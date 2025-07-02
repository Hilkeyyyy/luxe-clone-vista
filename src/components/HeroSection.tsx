
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { supabase } from '@/integrations/supabase/client';

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

const HeroSection = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('price', { ascending: false })
        .limit(4);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-white to-neutral-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-bold text-neutral-900 mb-6 leading-tight">
              Produtos
              <span className="block text-neutral-700">Premium</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 font-outfit max-w-2xl mx-auto leading-relaxed">
              Descubra nossa coleção exclusiva de produtos de alta qualidade, 
              cuidadosamente selecionados para você.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-neutral-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-bold text-neutral-900 mb-6 leading-tight">
            Relógios
            <span className="block bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
              Premium
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 font-outfit max-w-2xl mx-auto leading-relaxed mb-8">
            Descubra nossa coleção exclusiva de relógios de luxo, 
            cuidadosamente selecionados com a mais alta qualidade.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => navigate('/produtos')}
              className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-outfit font-semibold text-lg hover:bg-neutral-800 transition-colors shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Todos os Produtos
            </motion.button>
            <motion.button
              className="px-8 py-4 border-2 border-neutral-900 text-neutral-900 rounded-2xl font-outfit font-semibold text-lg hover:bg-neutral-900 hover:text-white transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Catálogo Premium
            </motion.button>
          </div>
        </motion.div>

        {/* Featured Products Grid */}
        {featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                originalPrice={product.original_price 
                  ? `R$ ${product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                  : undefined}
                image={product.images[0] || `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop`}
                featured={index === 0}
                isNew={product.is_new}
                clone_category={product.clone_category}
                delay={index * 0.2}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
