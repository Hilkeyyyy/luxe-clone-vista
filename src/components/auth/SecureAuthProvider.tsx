
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { secureLog } from '@/utils/secureLogger';
import { validateRequestOrigin } from '@/utils/securityHeaders';
import { csrfManager } from '@/utils/securityEnhancements';

interface AuthContextType {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  sessionValid: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SecureAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useRobustAuth();
  const [contextError, setContextError] = useState<string | null>(null);

  useEffect(() => {
    // Validate security context on mount
    if (!validateRequestOrigin()) {
      setContextError('Origem não autorizada');
      secureLog.error('Context security validation failed');
      return;
    }

    // Initialize CSRF protection
    csrfManager.generateToken();
    
    secureLog.info('Secure auth context initialized');
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    error: contextError || authState.error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSecureAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuthContext must be used within a SecureAuthProvider');
  }
  return context;
};
