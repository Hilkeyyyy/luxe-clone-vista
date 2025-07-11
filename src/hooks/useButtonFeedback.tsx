
import { useState, useCallback } from 'react';

interface ButtonState {
  isLoading: boolean;
  isSuccess: boolean;
}

export const useButtonFeedback = () => {
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>({});

  const setLoading = useCallback((productId: string, loading: boolean) => {
    setButtonStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        isLoading: loading
      }
    }));
  }, []);

  const triggerFeedback = useCallback((productId: string, duration: number = 1000) => {
    setButtonStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        isSuccess: true
      }
    }));

    setTimeout(() => {
      setButtonStates(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          isSuccess: false
        }
      }));
    }, duration);
  }, []);

  const getButtonState = useCallback((productId: string): ButtonState => {
    return buttonStates[productId] || { isLoading: false, isSuccess: false };
  }, [buttonStates]);

  return {
    setLoading,
    triggerFeedback,
    getButtonState
  };
};
