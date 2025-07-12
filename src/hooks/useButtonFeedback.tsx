
import { useState, useCallback, useRef } from 'react';

interface ButtonState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export const useButtonFeedback = () => {
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>({});
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  const setLoading = useCallback((buttonId: string, loading: boolean) => {
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: {
        ...prev[buttonId],
        isLoading: loading,
        isError: false
      }
    }));
  }, []);

  const triggerFeedback = useCallback((buttonId: string, duration: number = 2000) => {
    // Limpar timeout anterior se existir
    if (timeoutsRef.current[buttonId]) {
      clearTimeout(timeoutsRef.current[buttonId]);
    }

    // Marcar como sucesso
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: {
        isLoading: false,
        isSuccess: true,
        isError: false
      }
    }));

    // Reset automático após duration
    timeoutsRef.current[buttonId] = setTimeout(() => {
      setButtonStates(prev => ({
        ...prev,
        [buttonId]: {
          isLoading: false,
          isSuccess: false,
          isError: false
        }
      }));
      delete timeoutsRef.current[buttonId];
    }, duration);
  }, []);

  const triggerError = useCallback((buttonId: string, duration: number = 2000) => {
    if (timeoutsRef.current[buttonId]) {
      clearTimeout(timeoutsRef.current[buttonId]);
    }

    setButtonStates(prev => ({
      ...prev,
      [buttonId]: {
        isLoading: false,
        isSuccess: false,
        isError: true
      }
    }));

    timeoutsRef.current[buttonId] = setTimeout(() => {
      setButtonStates(prev => ({
        ...prev,
        [buttonId]: {
          isLoading: false,
          isSuccess: false,
          isError: false
        }
      }));
      delete timeoutsRef.current[buttonId];
    }, duration);
  }, []);

  const getButtonState = useCallback((buttonId: string): ButtonState => {
    return buttonStates[buttonId] || {
      isLoading: false,
      isSuccess: false,
      isError: false
    };
  }, [buttonStates]);

  const resetButton = useCallback((buttonId: string) => {
    if (timeoutsRef.current[buttonId]) {
      clearTimeout(timeoutsRef.current[buttonId]);
      delete timeoutsRef.current[buttonId];
    }
    
    setButtonStates(prev => {
      const newState = { ...prev };
      delete newState[buttonId];
      return newState;
    });
  }, []);

  return {
    setLoading,
    triggerFeedback,
    triggerError,
    getButtonState,
    resetButton
  };
};
