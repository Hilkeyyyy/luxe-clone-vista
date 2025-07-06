
import { useEffect } from 'react';

export const useLocalStorageCleanup = () => {
  const cleanupInvalidData = () => {
    try {
      // Verificar e limpar dados de carrinho inválidos
      const cart = localStorage.getItem('cart');
      if (cart) {
        const parsedCart = JSON.parse(cart);
        if (!Array.isArray(parsedCart)) {
          console.log('Limpando dados de carrinho inválidos');
          localStorage.removeItem('cart');
        }
      }

      // Verificar e limpar dados de favoritos inválidos
      const favorites = localStorage.getItem('favorites');
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        if (!Array.isArray(parsedFavorites)) {
          console.log('Limpando dados de favoritos inválidos');
          localStorage.removeItem('favorites');
        }
      }
    } catch (error) {
      console.error('Erro ao limpar dados do localStorage:', error);
      // Em caso de erro, remover todos os dados possivelmente corrompidos
      localStorage.removeItem('cart');
      localStorage.removeItem('favorites');
    }
  };

  const initializeLocalStorage = () => {
    // CORREÇÃO: NÃO inicializar arrays vazios desnecessariamente
    // Apenas limpar dados inválidos, mas não criar dados falsos
    if (localStorage.getItem('cart') === null) {
      // Só criar se realmente não existir
      localStorage.setItem('cart', JSON.stringify([]));
    }
    if (localStorage.getItem('favorites') === null) {
      // Só criar se realmente não existir
      localStorage.setItem('favorites', JSON.stringify([]));
    }
  };

  useEffect(() => {
    cleanupInvalidData();
    // CORREÇÃO: Não inicializar automaticamente para evitar contadores falsos
    // initializeLocalStorage();  <- Removido
  }, []);

  return { cleanupInvalidData, initializeLocalStorage };
};
