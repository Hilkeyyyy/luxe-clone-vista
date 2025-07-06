
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useAuthActions = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      
      // Mostrar toast informativo sobre necessidade de login
      toast({
        title: "🔐 Login necessário",
        description: "Você precisa fazer login ou criar uma conta para continuar.",
        duration: 4000,
      });
      
      return false;
    }
    action();
    return true;
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const switchToSignup = () => {
    setAuthMode('signup');
    toast({
      title: "📝 Criar conta",
      description: "Preencha os dados abaixo para criar sua conta gratuitamente.",
      duration: 3000,
    });
  };

  const switchToLogin = () => {
    setAuthMode('login');
    toast({
      title: "👋 Bem-vindo de volta",
      description: "Faça login para acessar sua conta.",
      duration: 3000,
    });
  };

  return {
    showAuthModal,
    authMode,
    setAuthMode,
    requireAuth,
    closeAuthModal,
    switchToSignup,
    switchToLogin,
    isAuthenticated,
  };
};
