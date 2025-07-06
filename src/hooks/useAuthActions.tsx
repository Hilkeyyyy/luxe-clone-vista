
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useAuthActions = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return false;
    }
    action();
    return true;
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return {
    showAuthModal,
    authMode,
    setAuthMode,
    requireAuth,
    closeAuthModal,
    isAuthenticated,
  };
};
