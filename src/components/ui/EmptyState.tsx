
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div 
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto">
        <Icon className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          {title}
        </h2>
        <p className="text-neutral-600 mb-8">
          {description}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
