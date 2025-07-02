
import React from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const allCategories = ['Todos', ...categories];

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'ETA Base':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Clone':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Super Clone':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {allCategories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category === 'Todos' ? '' : category)}
          className={`px-6 py-3 rounded-xl font-medium transition-all border-2 ${
            (selectedCategory === '' && category === 'Todos') || selectedCategory === category
              ? 'bg-neutral-900 text-white border-neutral-900'
              : `${getCategoryBadgeColor(category)} hover:shadow-md`
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;
