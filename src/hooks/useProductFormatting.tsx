
import { useMemo } from 'react';

export const useProductFormatting = () => {
  const formatPrice = useMemo(() => (price: number) => {
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }, []);

  const formatProductCount = useMemo(() => (count: number) => {
    return `${count} produto${count !== 1 ? 's' : ''}`;
  }, []);

  const formatItemCount = useMemo(() => (count: number) => {
    return `${count} item${count !== 1 ? 's' : ''}`;
  }, []);

  return {
    formatPrice,
    formatProductCount,
    formatItemCount,
  };
};
