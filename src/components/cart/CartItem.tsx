
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import PriceDisplay from '@/components/ui/PriceDisplay';

interface CartItemProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  index: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  brand,
  price,
  image,
  quantity,
  selectedColor,
  selectedSize,
  index,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <motion.div
      className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden bg-neutral-50 flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                {brand}
              </p>
              <h3 className="font-semibold text-neutral-900 truncate">
                {name}
              </h3>
              {(selectedColor || selectedSize) && (
                <div className="flex gap-4 mt-1 text-sm text-neutral-500">
                  {selectedColor && <span>Cor: {selectedColor}</span>}
                  {selectedSize && <span>Tamanho: {selectedSize}</span>}
                </div>
              )}
            </div>
            
            <div className="text-right">
              <PriceDisplay 
                price={price * quantity}
                size="lg"
              />
              <p className="text-sm text-neutral-500">
                R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} cada
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center bg-neutral-100 rounded-lg">
              <button
                onClick={() => onUpdateQuantity(id, quantity - 1)}
                className="p-2 hover:bg-neutral-200 rounded-l-lg transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(id, quantity + 1)}
                className="p-2 hover:bg-neutral-200 rounded-r-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => onRemove(id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
