
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const HeroSection = () => {
  const featuredProducts = [
    {
      name: "Clone Premium Pro",
      brand: "Mega Series",
      price: "R$ 1.299"
    },
    {
      name: "Elite Clone X1",
      brand: "Premium Line",
      price: "R$ 999"
    },
    {
      name: "Master Clone 2024",
      brand: "Professional",
      price: "R$ 1.599"
    },
    {
      name: "Super Clone Max",
      brand: "Ultra Series",
      price: "R$ 899"
    }
  ];

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
            Produtos
            <span className="block text-neutral-700">Premium</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 font-outfit max-w-2xl mx-auto leading-relaxed">
            Descubra nossa coleção exclusiva de produtos de alta qualidade, 
            cuidadosamente selecionados para você.
          </p>
        </motion.div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              brand={product.brand}
              price={product.price}
              featured={index === 0}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-outfit font-semibold text-lg hover:bg-neutral-800 transition-colors shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Todos os Produtos
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
