
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id?: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  featured?: boolean;
  delay?: number;
  isNew?: boolean;
  image?: string;
}

const ProductCard = ({ 
  id,
  name, 
  brand, 
  price, 
  originalPrice, 
  featured = false, 
  delay = 0, 
  isNew = false,
  image 
}: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/produto/${id}`);
    }
  };

  // Calculate discount percentage
  const discountPercentage = originalPrice && originalPrice !== price
    ? Math.round(((parseFloat(originalPrice.replace('R$ ', '').replace('.', '').replace(',', '.')) - 
                  parseFloat(price.replace('R$ ', '').replace('.', '').replace(',', '.'))) / 
                  parseFloat(originalPrice.replace('R$ ', '').replace('.', '').replace(',', '.'))) * 100)
    : 0;

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
        featured ? 'ring-2 ring-neutral-200' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center relative overflow-hidden">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          {featured && (
            <div className="bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-outfit font-medium">
              Destaque
            </div>
          )}
          {isNew && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-outfit font-medium">
              Novo
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-outfit font-medium">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Product Image */}
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-32 h-32 bg-neutral-200 rounded-full flex items-center justify-center">
            <span className="text-neutral-500 font-outfit font-medium text-lg">IMG</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-outfit font-semibold text-xl text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
          {name}
        </h3>
        <p className="text-neutral-600 font-outfit mb-4">
          {brand}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-outfit font-bold text-neutral-900">
              {price}
            </span>
            {originalPrice && originalPrice !== price && (
              <span className="text-sm text-neutral-500 line-through">
                {originalPrice}
              </span>
            )}
          </div>
          <motion.button
            className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-outfit font-medium hover:bg-neutral-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Ver Detalhes
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
