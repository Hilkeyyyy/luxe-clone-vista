
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Truck, Award } from 'lucide-react';
import ProductCard from './ProductCard';
import VerticalBrandCarousel from './VerticalBrandCarousel';
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

  const stats = [
    { icon: Star, value: '4.9/5', label: 'Avaliação' },
    { icon: Shield, value: '100%', label: 'Seguro' },
    { icon: Truck, value: 'Grátis', label: 'Entrega' },
    { icon: Award, value: '5+', label: 'Anos' },
  ];

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-white to-neutral-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-bold text-neutral-900 mb-6 leading-tight">
              Relógios
              <span className="block text-neutral-700">Premium</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 font-outfit max-w-2xl mx-auto leading-relaxed">
              Descubra nossa coleção exclusiva de relógios de luxo, 
              cuidadosamente selecionados com a mais alta qualidade.
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
        {/* Layout Principal com Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Coluna Principal - Hero Content */}
          <div className="lg:col-span-3">
            {/* Hero Header */}
            <motion.div 
              className="text-center lg:text-left mb-16"
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
              <p className="text-lg sm:text-xl text-neutral-600 font-outfit max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Descubra nossa coleção exclusiva de relógios de luxo, 
                cuidadosamente selecionados com a mais alta qualidade.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <motion.button
                  onClick={() => navigate('/produtos')}
                  className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-outfit font-semibold text-lg hover:bg-neutral-800 transition-colors shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Todos os Produtos
                </motion.button>
                <motion.button
                  onClick={() => navigate('/produtos')}
                  className="px-8 py-4 border-2 border-neutral-900 text-neutral-900 rounded-2xl font-outfit font-semibold text-lg hover:bg-neutral-900 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Catálogo Premium
                </motion.button>
              </div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-xl mb-4">
                      <stat.icon className="w-6 h-6 text-neutral-700" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-neutral-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Featured Products Grid */}
            {featuredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-neutral-900 text-center lg:text-left mb-12">
                  Produtos em Destaque
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProducts.slice(0, 3).map((product, index) => (
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
              </motion.div>
            )}
          </div>

          {/* Coluna Lateral - Carrossel de Marcas */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="sticky top-8"
            >
              <VerticalBrandCarousel />
            </motion.div>
          </div>
        </div>

        {/* Trust Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-neutral-900 mb-8">Por que escolher a Mega Clones?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
              <h4 className="font-semibold text-neutral-900 mb-2">Qualidade Garantida</h4>
              <p className="text-neutral-600 text-sm">Produtos testados e aprovados com garantia de qualidade.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <Truck className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-neutral-900 mb-2">Entrega Segura</h4>
              <p className="text-neutral-600 text-sm">Envio discreto e seguro para todo o Brasil.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <Award className="w-8 h-8 text-amber-600 mx-auto mb-4" />
              <h4 className="font-semibold text-neutral-900 mb-2">Experiência</h4>
              <p className="text-neutral-600 text-sm">Mais de 5 anos oferecendo os melhores produtos.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
