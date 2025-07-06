
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useProductFormatting } from '@/hooks/useProductFormatting';

interface FavoritesHeaderProps {
  count: number;
}

const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({ count }) => {
  const { formatProductCount } = useProductFormatting();

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center mb-4">
        <Heart className="w-8 h-8 text-red-600 mr-3" fill="currentColor" />
        <h1 className="text-4xl font-bold text-neutral-900">Meus Favoritos</h1>
      </div>
      <p className="text-neutral-600 text-lg">
        {count > 0 
          ? `${formatProductCount(count)} favorito${count !== 1 ? 's' : ''}`
          : 'Você ainda não tem produtos favoritos'
        }
      </p>
    </motion.div>
  );
};

export default FavoritesHeader;
