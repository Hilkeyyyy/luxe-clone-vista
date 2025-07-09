
import React from 'react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  description?: string;
  colors: string[];
  sizes: string[];
  in_stock: boolean;
  is_new: boolean;
  category: string;
  stock_status?: string;
}

interface ProductInfoProps {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
}

const ProductInfo = ({ 
  product, 
  selectedColor, 
  selectedSize, 
  onColorChange, 
  onSizeChange 
}: ProductInfoProps) => {
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Product Title & Brand */}
      <div>
        {product.is_new && (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mb-3">
            NOVIDADE
          </span>
        )}
        <h1 className="text-3xl lg:text-4xl font-outfit font-bold text-neutral-900 mb-2">
          {product.name}
        </h1>
        <p className="text-lg text-neutral-600 font-outfit">
          {product.brand}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-outfit font-bold text-neutral-900">
          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
        {product.original_price && product.original_price > product.price && (
          <>
            <span className="text-xl text-neutral-500 line-through">
              R$ {product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
              -{discountPercentage}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="prose prose-neutral max-w-none">
          <p className="text-neutral-700 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-outfit font-medium text-neutral-900">
            Cor: <span className="font-normal capitalize">{selectedColor}</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`px-4 py-2 border-2 rounded-xl font-outfit font-medium capitalize transition-all ${
                  selectedColor === color
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-outfit font-medium text-neutral-900">
            Tamanho: <span className="font-normal">{selectedSize}</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-4 py-2 border-2 rounded-xl font-outfit font-medium transition-all ${
                  selectedSize === size
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status - CORRIGIDO PARA MOSTRAR ESGOTADO */}
      <div className={`flex items-center space-x-2 ${
        (product.stock_status || (product.in_stock ? 'in_stock' : 'out_of_stock')) === 'in_stock' ? 'text-green-600' : 
        (product.stock_status || (product.in_stock ? 'in_stock' : 'out_of_stock')) === 'low_stock' ? 'text-yellow-600' : 
        'text-red-600'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          (product.stock_status || (product.in_stock ? 'in_stock' : 'out_of_stock')) === 'in_stock' ? 'bg-green-500' : 
          (product.stock_status || (product.in_stock ? 'in_stock' : 'out_of_stock')) === 'low_stock' ? 'bg-yellow-500' : 
          'bg-red-500'
        }`}></div>
        <span className="text-sm font-medium">
          {(product.stock_status || (product.in_stock ? 'in_stock' : 'out_of_stock')) === 'in_stock' ? 'Em estoque' : 
           (product.stock_status || (product.in_stock ? 'in_stock' : 'out_of_stock')) === 'low_stock' ? 'Pouco estoque' : 
           'Esgotado'}
        </span>
      </div>
    </motion.div>
  );
};

export default ProductInfo;
