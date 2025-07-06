
import React from 'react';
import { motion } from 'framer-motion';

const ProductsHeader: React.FC = () => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">Nossos Produtos</h1>
      <p className="text-neutral-600 text-lg">
        Explore nossa coleção completa de relógios premium
      </p>
    </motion.div>
  );
};

export default ProductsHeader;
