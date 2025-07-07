import { useState, useCallback } from 'react';

interface ButtonState {
  isLoading: boolean;
  isSuccess: boolean;
}

export const useButtonFeedback = () => {
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>({});

  const triggerFeedback = useCallback((buttonId: string, duration: number = 1500) => {
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: { isLoading: false, isSuccess: true }
    }));

    setTimeout(() => {
      setButtonStates(prev => ({
        ...prev,
        [buttonId]: { isLoading: false, isSuccess: false }
      }));
    }, duration);
  }, []);

  const setLoading = useCallback((buttonId: string, loading: boolean) => {
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: { ...prev[buttonId], isLoading: loading }
    }));
  }, []);

  const getButtonState = useCallback((buttonId: string): ButtonState => {
    return buttonStates[buttonId] || { isLoading: false, isSuccess: false };
  }, [buttonStates]);

  return {
    triggerFeedback,
    setLoading,
    getButtonState
  };
};