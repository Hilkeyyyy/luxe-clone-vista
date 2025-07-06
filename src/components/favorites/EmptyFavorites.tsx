
import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '@/components/ui/EmptyState';

const EmptyFavorites: React.FC = () => {
  return (
    <EmptyState
      icon={Heart}
      title="Nenhum produto favorito"
      description="Explore nossa coleção e adicione produtos aos seus favoritos clicando no ícone de coração."
      action={{
        label: (
          <>
            <ShoppingBag className="w-5 h-5 mr-2" />
            Explorar Produtos
          </>
        ) as any,
        onClick: () => window.location.href = '/produtos'
      }}
    />
  );
};

export default EmptyFavorites;
