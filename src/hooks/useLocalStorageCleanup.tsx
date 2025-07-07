
import { useEffect } from 'react';

export const useLocalStorageCleanup = () => {
  const cleanupInvalidData = () => {
    console.log('🧹 LIMPEZA: Iniciando limpeza completa do localStorage...');
    
    try {
      // CORREÇÃO CRÍTICA: Remover TODOS os dados obsoletos de carrinho e favoritos do localStorage
      const obsoleteKeys = ['cart', 'favorites', 'cartItems', 'favoriteItems'];
      
      obsoleteKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          console.log(`🗑️ Removendo ${key} obsoleto:`, value);
          localStorage.removeItem(key);
        }
      });
      
      console.log('✅ Limpeza concluída - agora usando apenas banco de dados');
    } catch (error) {
      console.error('❌ Erro ao limpar dados do localStorage:', error);
      // Em caso de erro, forçar remoção individual
      try {
        localStorage.removeItem('cart');
        localStorage.removeItem('favorites');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('favoriteItems');
      } catch (e) {
        console.error('❌ Erro crítico na limpeza:', e);
      }
    }
  };

  const resetLocalStorage = () => {
    console.log('🔄 RESET COMPLETO do localStorage');
    const keysToRemove = ['cart', 'favorites', 'cartItems', 'favoriteItems'];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('✅ LocalStorage resetado completamente');
  };

  useEffect(() => {
    console.log('🔧 useLocalStorageCleanup: Executando limpeza automática...');
    cleanupInvalidData();
  }, []);

  return { 
    cleanupInvalidData, 
    resetLocalStorage
  };
};
