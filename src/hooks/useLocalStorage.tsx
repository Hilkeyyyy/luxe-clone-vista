
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        // Se não existe, inicializar com valor padrão
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      const parsed = JSON.parse(item);
      // Validar se o tipo está correto
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
        console.warn(`Dados inválidos para ${key}, reinicializando`);
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      return parsed;
    } catch (error) {
      console.error(`Erro ao ler ${key} do localStorage:`, error);
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
  });

  const updateValue = (newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Disparar eventos personalizados para atualizar contadores
      if (key === 'cart') {
        window.dispatchEvent(new Event('cartUpdated'));
      } else if (key === 'favorites') {
        window.dispatchEvent(new Event('favoritesUpdated'));
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setValue(newValue);
        } catch (error) {
          console.error(`Erro ao processar mudança em ${key}:`, error);
          setValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [value, updateValue] as const;
};
