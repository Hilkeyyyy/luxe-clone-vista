
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedCloneCategory: string;
  onCloneCategoryChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  categories: string[];
  cloneCategories: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCloneCategory,
  onCloneCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
  categories,
  cloneCategories,
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Filter size={20} className="text-neutral-600" />
        <h2 className="text-lg font-semibold text-neutral-900">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="all">Todas as Categorias</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={selectedCloneCategory}
          onChange={(e) => onCloneCategoryChange(e.target.value)}
          className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="all">Todos os Tipos</option>
          {cloneCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={priceRange}
          onChange={(e) => onPriceRangeChange(e.target.value)}
          className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="all">Todas as Faixas</option>
          <option value="under-500">Até R$ 500</option>
          <option value="500-1000">R$ 500 - R$ 1.000</option>
          <option value="1000-2000">R$ 1.000 - R$ 2.000</option>
          <option value="over-2000">Acima de R$ 2.000</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          <option value="newest">Mais Recentes</option>
          <option value="featured">Destaques Primeiro</option>
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
          <option value="name">Nome A-Z</option>
        </select>
      </div>
    </motion.div>
  );
};

export default ProductFilters;
