import { useEnhancedAuth } from './useEnhancedAuth';

// Re-export the enhanced auth hook as the main auth hook
export const useAuth = () => {
  return useEnhancedAuth();
};

// Keep backward compatibility
export { useEnhancedAuth };
