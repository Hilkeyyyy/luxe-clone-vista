
import React from 'react';
import { motion } from 'framer-motion';

interface ProductSpecsProps {
  specifications: any;
}

const ProductSpecs = ({ specifications }: ProductSpecsProps) => {
  if (!specifications || typeof specifications !== 'object') {
    return null;
  }

  const formatSpecValue = (value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return JSON.stringify(value);
  };

  const formatSpecKey = (key: string): string => {
    // Convert camelCase or snake_case to readable format
    const keyMappings: { [key: string]: string } = {
      movement: 'Movimento',
      diameter: 'Diâmetro',
      material: 'Material',
      water_resistance: 'Resistência à Água',
      case_material: 'Material da Caixa',
      band_material: 'Material da Pulseira',
      crystal: 'Cristal',
      functions: 'Funções',
      power_reserve: 'Reserva de Energia',
      weight: 'Peso',
      thickness: 'Espessura'
    };
    
    return keyMappings[key] || key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Consolidar especificações básicas com avançadas
  const allSpecs = {
    ...specifications,
    ...(specifications.movement && { movement: specifications.movement }),
    ...(specifications.diameter && { diameter: specifications.diameter }),
    ...(specifications.material && { material: specifications.material }),
    ...(specifications.water_resistance && { water_resistance: specifications.water_resistance })
  };

  return (
    <motion.div 
      className="mt-16 bg-neutral-50 rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h2 className="text-2xl font-outfit font-semibold text-neutral-900 mb-6">
        Especificações Técnicas
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(allSpecs).map(([key, value], index) => (
          <motion.div
            key={key}
            className="flex justify-between items-center p-4 bg-white rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
          >
            <span className="font-outfit font-medium text-neutral-700">
              {formatSpecKey(key)}:
            </span>
            <span className="font-outfit text-neutral-900 text-right max-w-[200px] break-words">
              {formatSpecValue(value)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductSpecs;
