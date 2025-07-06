
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Zap } from 'lucide-react';

interface CloneCategoryHighlightProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CloneCategoryHighlight: React.FC<CloneCategoryHighlightProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const getCloneCategoryIcon = (category: string) => {
    switch (category) {
      case 'ETA Base':
        return <Star className="w-4 h-4" />;
      case 'Super Clone':
        return <Award className="w-4 h-4" />;
      case 'Clone':
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCloneCategoryColor = (category: string) => {
    switch (category) {
      case 'ETA Base':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Super Clone':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Clone':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Categorias de Qualidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedCategory === category
                  ? getCloneCategoryColor(category) + ' border-current shadow-md scale-105'
                  : 'bg-white hover:bg-neutral-50 border-neutral-200'
              }`}
            >
              {getCloneCategoryIcon(category)}
              <div className="text-left">
                <h3 className="font-semibold">{category}</h3>
                <p className="text-sm opacity-70">
                  {category === 'ETA Base' && 'Movimento ETA suíço'}
                  {category === 'Super Clone' && 'Máxima qualidade'}
                  {category === 'Clone' && 'Ótimo custo-benefício'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CloneCategoryHighlight;
