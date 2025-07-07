
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ProductionDebugPanelProps {
  debugInfo: string;
  onRefetch: () => void;
  productCounts: {
    new: number;
    featured: number;
    offers: number;
  };
}

const ProductionDebugPanel: React.FC<ProductionDebugPanelProps> = ({
  debugInfo,
  onRefetch,
  productCounts
}) => {
  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('preview');
  const hasProducts = productCounts.new > 0 || productCounts.featured > 0 || productCounts.offers > 0;
  
  // Só mostrar em produção ou quando há problemas
  if (!isProduction && hasProducts) return null;

  const getStatusIcon = () => {
    if (debugInfo.includes('✅')) return <CheckCircle className="text-green-500" size={16} />;
    if (debugInfo.includes('⚠️') || debugInfo.includes('🆘')) return <AlertTriangle className="text-yellow-500" size={16} />;
    if (debugInfo.includes('💥')) return <XCircle className="text-red-500" size={16} />;
    return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
  };

  return (
    <motion.div 
      className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50 border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {isProduction ? 'Produção' : 'Desenvolvimento'}
          </span>
        </div>
        <button
          onClick={onRefetch}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Recarregar produtos"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        {debugInfo}
      </div>
      
      <div className="text-xs space-y-1">
        <div>Novos: {productCounts.new}</div>
        <div>Destaques: {productCounts.featured}</div>
        <div>Ofertas: {productCounts.offers}</div>
      </div>
      
      {(!hasProducts || debugInfo.includes('🆘')) && (
        <div className="mt-2 text-xs text-orange-600">
          Usando produtos de demonstração
        </div>
      )}
    </motion.div>
  );
};

export default ProductionDebugPanel;
