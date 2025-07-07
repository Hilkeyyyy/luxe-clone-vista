
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Database } from 'lucide-react';

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
  const isUsingFallback = debugInfo.includes('demo') || debugInfo.includes('🆘') || debugInfo.includes('⚠️');
  
  // Mostrar sempre em desenvolvimento, ou em produção quando há problemas
  if (!isProduction && hasProducts && !isUsingFallback) return null;

  const getStatusIcon = () => {
    if (debugInfo.includes('✅')) return <CheckCircle className="text-green-500" size={16} />;
    if (debugInfo.includes('⚠️') || debugInfo.includes('🆘')) return <AlertTriangle className="text-yellow-500" size={16} />;
    if (debugInfo.includes('💥')) return <XCircle className="text-red-500" size={16} />;
    return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
  };

  const getStatusColor = () => {
    if (debugInfo.includes('✅')) return 'border-green-200 bg-green-50';
    if (debugInfo.includes('⚠️') || debugInfo.includes('🆘')) return 'border-yellow-200 bg-yellow-50';
    if (debugInfo.includes('💥')) return 'border-red-200 bg-red-50';
    return 'border-blue-200 bg-blue-50';
  };

  return (
    <motion.div 
      className={`fixed bottom-4 right-4 shadow-lg rounded-lg p-3 max-w-xs z-50 border-2 ${getStatusColor()}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {isProduction ? '🌐 Produção' : '🔧 Dev'}
          </span>
          <Database size={14} className="text-gray-500" />
        </div>
        <button
          onClick={onRefetch}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Recarregar produtos"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      
      <div className="text-xs text-gray-700 mb-2 font-mono">
        {debugInfo}
      </div>
      
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Novos:</span>
          <span className="font-mono">{productCounts.new}</span>
        </div>
        <div className="flex justify-between">
          <span>Destaques:</span>
          <span className="font-mono">{productCounts.featured}</span>
        </div>
        <div className="flex justify-between">
          <span>Ofertas:</span>
          <span className="font-mono">{productCounts.offers}</span>
        </div>
      </div>
      
      {isUsingFallback && (
        <div className="mt-2 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
          ⚠️ Usando dados demo
        </div>
      )}
    </motion.div>
  );
};

export default ProductionDebugPanel;
