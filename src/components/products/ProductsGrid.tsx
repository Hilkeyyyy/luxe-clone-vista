
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  clone_category: string;
  stock_status: string;
  is_sold_out: boolean;
  custom_badge?: string;
  is_bestseller: boolean;
  is_featured: boolean;
  is_new: boolean;
  category: string;
  created_at: string;
}

interface ProductsGridProps {
  products: Product[];
  onClearFilters: () => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onClearFilters }) => {
  if (products.length === 0) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <p className="text-neutral-600 text-lg mb-4">Nenhum produto encontrado</p>
        <button
          onClick={onClearFilters}
          className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Limpar Filtros
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          brand={product.brand}
          price={`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          originalPrice={product.original_price ? `R$ ${product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : undefined}
          image={product.images[0]}
          clone_category={product.clone_category}
          stock_status={product.stock_status}
          is_sold_out={product.is_sold_out}
          custom_badge={product.custom_badge}
          is_bestseller={product.is_bestseller}
          is_featured={product.is_featured}
          isNew={product.is_new}
          delay={index * 0.1}
          simplified={true}
        />
      ))}
    </motion.div>
  );
};

export default ProductsGrid;
