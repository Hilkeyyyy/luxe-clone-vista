
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const PRODUCT_CATEGORIES = {
  'ETA BÁSICO': {
    label: 'ETA BÁSICO',
    description: 'Réplicas com movimento ETA básico, qualidade entrada',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Shield,
    priority: 1
  },
  'CLONE': {
    label: 'CLONE',
    description: 'Réplicas de alta qualidade com detalhes precisos',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Award,
    priority: 2
  },
  'SUPER CLONE': {
    label: 'SUPER CLONE',
    description: 'Réplicas premium com máxima qualidade e precisão',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Star,
    priority: 3
  }
} as const;

export type ProductCategoryType = keyof typeof PRODUCT_CATEGORIES;

interface ProductCategoriesProps {
  selectedCategory?: ProductCategoryType;
  onCategorySelect: (category: ProductCategoryType) => void;
  showDescription?: boolean;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  selectedCategory,
  onCategorySelect,
  showDescription = true
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">
        Categorias de Produtos
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === key;
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-neutral-900 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => onCategorySelect(key as ProductCategoryType)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon size={20} className="text-neutral-700" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                    <Badge className={category.color}>
                      Nível {category.priority}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                {showDescription && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-neutral-600">
                      {category.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCategories;
