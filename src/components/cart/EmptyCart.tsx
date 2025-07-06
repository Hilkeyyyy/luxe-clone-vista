
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

const EmptyCart: React.FC = () => {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="Seu carrinho está vazio"
      description="Explore nossa coleção e adicione produtos ao seu carrinho."
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

export default EmptyCart;
