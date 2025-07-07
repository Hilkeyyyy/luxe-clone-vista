
import { useAuth } from './useAuth';

// Hook específico para verificações de admin
export const useAuthCheck = () => {
  const authState = useAuth();
  
  return {
    ...authState,
    // Verificação adicional de segurança para admin
    isAdminVerified: authState.isAuthenticated && authState.user?.isAdmin === true
  };
};
