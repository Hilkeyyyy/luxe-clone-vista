
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200/50 p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center mb-6">
        <Filter className="w-5 h-5 text-neutral-600 mr-2" />
        <h3 className="text-lg font-semibold text-neutral-900">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/70 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>

        {/* Marca/Categoria */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-white/70 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="Todas as Marcas" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-neutral-200">
            <SelectItem value="all">Todas as Marcas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tipo de Relógio */}
        <Select value={selectedCloneCategory} onValueChange={onCloneCategoryChange}>
          <SelectTrigger className="bg-white/70 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="Todos os Tipos" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-neutral-200">
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="ETA Base">ETA Base</SelectItem>
            <SelectItem value="Clone">Clone</SelectItem>
            <SelectItem value="Super Clone">Super Clone</SelectItem>
          </SelectContent>
        </Select>

        {/* Faixa de Preço */}
        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="bg-white/70 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="Todas as Faixas" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-neutral-200">
            <SelectItem value="all">Todas as Faixas</SelectItem>
            <SelectItem value="under-500">Até R$ 500</SelectItem>
            <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
            <SelectItem value="1000-2000">R$ 1.000 - R$ 2.000</SelectItem>
            <SelectItem value="over-2000">Acima de R$ 2.000</SelectItem>
          </SelectContent>
        </Select>

        {/* Ordenação */}
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="bg-white/70 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="Mais Recentes" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-neutral-200">
            <SelectItem value="newest">Mais Recentes</SelectItem>
            <SelectItem value="price-asc">Menor Preço</SelectItem>
            <SelectItem value="price-desc">Maior Preço</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
            <SelectItem value="featured">Destaques</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default ProductFilters;
