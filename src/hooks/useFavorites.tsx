
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// HOOK OBSOLETO - MIGRADO PARA useSecureFavorites
// Este hook agora redireciona para o novo sistema baseado em banco de dados

export const useFavorites = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    console.log('⚠️ AVISO: useFavorites está obsoleto - use useSecureFavorites');
    
    // Limpar dados antigos do localStorage
    const oldFavorites = localStorage.getItem('favorites');
    if (oldFavorites) {
      console.log('🗑️ Removendo dados antigos de favoritos do localStorage');
      localStorage.removeItem('favorites');
    }
    
    toast({
      title: "Sistema Atualizado",
      description: "Seus favoritos agora são salvos com segurança no banco de dados. Faça login para acessar.",
      duration: 5000,
    });
  }, []);

  // Funções vazias para compatibilidade
  const toggleFavorite = () => {
    console.log('⚠️ Use useSecureFavorites.toggleFavorite()');
  };

  const isFavorite = () => false;

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
