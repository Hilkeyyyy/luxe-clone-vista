
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ErrorFeedbackProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

const ErrorFeedback: React.FC<ErrorFeedbackProps> = ({
  title = "Ops! Algo deu errado",
  message = "Ocorreu um erro inesperado. Tente novamente.",
  showRetry = true,
  showHome = true,
  onRetry,
  type = 'error'
}) => {
  const navigate = useNavigate();

  const colors = {
    error: {
      bg: 'bg-red-50/90',
      border: 'border-red-200/50',
      text: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-500'
    },
    warning: {
      bg: 'bg-yellow-50/90',
      border: 'border-yellow-200/50',
      text: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      icon: 'text-yellow-500'
    },
    info: {
      bg: 'bg-blue-50/90',
      border: 'border-blue-200/50',
      text: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-500'
    }
  };

  const colorScheme = colors[type];

  return (
    <motion.div 
      className={`text-center py-12 px-6 ${colorScheme.bg} backdrop-blur-sm border-2 ${colorScheme.border} rounded-2xl shadow-lg max-w-md mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <AlertTriangle size={48} className={`mx-auto mb-4 ${colorScheme.icon}`} />
      </motion.div>
      
      <h3 className={`text-xl font-semibold mb-2 ${colorScheme.text}`}>
        {title}
      </h3>
      
      <p className="text-neutral-600 mb-6">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {showRetry && onRetry && (
          <motion.button
            onClick={onRetry}
            className={`px-6 py-3 ${colorScheme.button} text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            <span>Tentar Novamente</span>
          </motion.button>
        )}
        
        {showHome && (
          <motion.button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={16} />
            <span>Voltar ao Início</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorFeedback;
