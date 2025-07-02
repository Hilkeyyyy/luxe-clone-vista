
import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  name: string;
  brand: string;
  price: string;
  featured?: boolean;
  delay?: number;
}

const ProductCard = ({ name, brand, price, featured = false, delay = 0 }: ProductCardProps) => {
  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${
        featured ? 'ring-2 ring-neutral-200' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center relative">
        {featured && (
          <div className="absolute top-4 right-4 bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-outfit font-medium">
            Destaque
          </div>
        )}
        <div className="w-32 h-32 bg-neutral-200 rounded-full flex items-center justify-center">
          <span className="text-neutral-500 font-outfit font-medium text-lg">IMG</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-outfit font-semibold text-xl text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
          {name}
        </h3>
        <p className="text-neutral-600 font-outfit mb-4">
          {brand}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-outfit font-bold text-neutral-900">
            {price}
          </span>
          <motion.button
            className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-outfit font-medium hover:bg-neutral-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Detalhes
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
