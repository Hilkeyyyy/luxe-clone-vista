
import { useEffect } from 'react';

export const useLocalStorageCleanup = () => {
  const cleanupInvalidData = () => {
    console.log('🧹 Iniciando limpeza do localStorage...');
    
    try {
      // Verificar e limpar dados de carrinho inválidos
      const cart = localStorage.getItem('cart');
      if (cart) {
        console.log('🛒 Verificando dados do carrinho:', cart);
        try {
          const parsedCart = JSON.parse(cart);
          if (!Array.isArray(parsedCart)) {
            console.log('❌ Dados de carrinho inválidos, removendo');
            localStorage.removeItem('cart');
          } else {
            console.log('✅ Dados do carrinho válidos:', parsedCart.length, 'itens');
          }
        } catch (error) {
          console.log('❌ Erro ao fazer parse do carrinho, removendo');
          localStorage.removeItem('cart');
        }
      }

      // Verificar e limpar dados de favoritos inválidos
      const favorites = localStorage.getItem('favorites');
      if (favorites) {
        console.log('❤️ Verificando dados de favoritos:', favorites);
        try {
          const parsedFavorites = JSON.parse(favorites);
          if (!Array.isArray(parsedFavorites)) {
            console.log('❌ Dados de favoritos inválidos, removendo');
            localStorage.removeItem('favorites');
          } else {
            console.log('✅ Dados dos favoritos válidos:', parsedFavorites.length, 'itens');
          }
        } catch (error) {
          console.log('❌ Erro ao fazer parse dos favoritos, removendo');
          localStorage.removeItem('favorites');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao limpar dados do localStorage:', error);
      // Em caso de erro, remover todos os dados possivelmente corrompidos
      localStorage.removeItem('cart');
      localStorage.removeItem('favorites');
    }
  };

  // CORREÇÃO CRÍTICA: Função para reset completo do localStorage
  const resetLocalStorage = () => {
    console.log('🔄 RESET COMPLETO do localStorage');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    
    // Disparar eventos para atualizar contadores
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('favoritesUpdated'));
    
    console.log('✅ LocalStorage resetado completamente');
  };

  // CORREÇÃO CRÍTICA: Remover inicialização automática que causa o bug do "1"
  const initializeLocalStorage = () => {
    console.log('🚀 Verificando se precisa inicializar localStorage...');
    
    // APENAS verificar se existem, NÃO criar automaticamente
    const cart = localStorage.getItem('cart');
    const favorites = localStorage.getItem('favorites');
    
    console.log('Estado atual:', {
      cart: cart ? 'existe' : 'não existe',
      favorites: favorites ? 'existe' : 'não existe'
    });
    
    // NÃO inicializar automaticamente para evitar contadores falsos
    // Os arrays serão criados apenas quando o usuário realmente adicionar itens
  };

  useEffect(() => {
    console.log('🔧 useLocalStorageCleanup iniciado');
    cleanupInvalidData();
    // CORREÇÃO: NÃO inicializar automaticamente
    // initializeLocalStorage(); <- REMOVIDO PARA CORRIGIR O BUG
  }, []);

  return { 
    cleanupInvalidData, 
    initializeLocalStorage, 
    resetLocalStorage // Nova função para casos extremos
  };
};
