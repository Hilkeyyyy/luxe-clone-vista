
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      console.log(`🔍 useLocalStorage[${key}]: Valor encontrado:`, item);
      
      if (item === null || item === 'null') {
        // CORREÇÃO CRÍTICA: NÃO inicializar automaticamente
        console.log(`📝 useLocalStorage[${key}]: Não existe, retornando valor inicial SEM salvar`);
        return initialValue;
      }
      
      const parsed = JSON.parse(item);
      
      // Validar se o tipo está correto
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
        console.warn(`⚠️ useLocalStorage[${key}]: Dados inválidos, reinicializando`);
        localStorage.removeItem(key);
        return initialValue;
      }
      
      console.log(`✅ useLocalStorage[${key}]: Valor válido carregado:`, parsed);
      return parsed;
    } catch (error) {
      console.error(`❌ useLocalStorage[${key}]: Erro ao ler, removendo:`, error);
      localStorage.removeItem(key);
      return initialValue;
    }
  });

  const updateValue = (newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      console.log(`💾 useLocalStorage[${key}]: Salvando valor:`, valueToStore);
      
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Disparar eventos personalizados para atualizar contadores
      if (key === 'cart') {
        console.log('🛒 Disparando evento cartUpdated');
        window.dispatchEvent(new Event('cartUpdated'));
      } else if (key === 'favorites') {
        console.log('❤️ Disparando evento favoritesUpdated');
        window.dispatchEvent(new Event('favoritesUpdated'));
      }
    } catch (error) {
      console.error(`❌ useLocalStorage[${key}]: Erro ao salvar:`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          console.log(`📡 useLocalStorage[${key}]: Storage mudou externamente:`, e.newValue);
          const newValue = JSON.parse(e.newValue);
          setValue(newValue);
        } catch (error) {
          console.error(`❌ useLocalStorage[${key}]: Erro ao processar mudança externa:`, error);
          setValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [value, updateValue] as const;
};
