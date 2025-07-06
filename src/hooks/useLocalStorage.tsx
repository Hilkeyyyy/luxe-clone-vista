
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const updateValue = (newValue: T | ((prev: T) => T)) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = localStorage.getItem(key);
        setValue(item ? JSON.parse(item) : initialValue);
      } catch {
        setValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [value, updateValue] as const;
};
