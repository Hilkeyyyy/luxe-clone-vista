
import { useState, useEffect } from 'react';
import { useRobustAuth } from './useRobustAuth';

interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  profile?: {
    full_name: string;
    role: string;
  };
}

export const useAuthCheck = () => {
  const authState = useRobustAuth();
  
  return {
    user: authState.user,
    loading: authState.loading,
    isAdmin: authState.isAdmin,
    isAuthenticated: authState.isAuthenticated,
    sessionValid: authState.sessionValid,
    error: authState.error
  };
};
