
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface CurrencyInputProps {
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = 0,
  onChange,
  placeholder = "R$ 0,00",
  className
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const parseCurrency = (str: string): number => {
    const cleanStr = str
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove tudo exceto números, vírgula e ponto
    const cleanValue = inputValue.replace(/[^\d,]/g, '');
    
    if (cleanValue === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Converte para número
    const numericValue = parseCurrency(cleanValue);
    
    // Formata para exibição
    if (numericValue > 0) {
      setDisplayValue(formatCurrency(numericValue));
    } else {
      setDisplayValue(cleanValue);
    }
    
    onChange(numericValue);
  };

  const handleBlur = () => {
    if (displayValue && !displayValue.includes('R$')) {
      const numValue = parseCurrency(displayValue);
      if (numValue > 0) {
        setDisplayValue(formatCurrency(numValue));
      }
    }
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
    />
  );
};
