import { useSimpleAuth } from './useSimpleAuth';

// Main auth hook - now using the simplified version
export const useAuth = () => {
  return useSimpleAuth();
};

// Keep backward compatibility
export { useSimpleAuth };
