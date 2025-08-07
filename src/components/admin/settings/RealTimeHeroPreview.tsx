import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface RealTimeHeroPreviewProps {
  settings: any;
}

const RealTimeHeroPreview: React.FC<RealTimeHeroPreviewProps> = ({ settings }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar preview após mudanças
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [settings.hero_title, settings.hero_subtitle, settings.hero_background_image, settings.hero_overlay_opacity]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 w-80 h-48 bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-primary z-50"
    >
      <div className="bg-primary text-white px-3 py-1 text-sm font-medium">
        Preview em Tempo Real
      </div>
      <div 
        className="relative h-full bg-cover bg-center flex items-center justify-center"
        style={{ 
          backgroundImage: settings.hero_background_image 
            ? `url(${settings.hero_background_image})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: parseFloat(settings.hero_overlay_opacity || '0.7') }}
        />
        <div 
          className={`relative z-10 text-white px-4 ${
            settings.hero_text_position === 'left' ? 'text-left' : 
            settings.hero_text_position === 'right' ? 'text-right' : 'text-center'
          }`}
        >
          <h3 className="text-sm font-bold mb-2 line-clamp-2">
            {settings.hero_title || 'SEU TÍTULO AQUI'}
          </h3>
          {settings.hero_subtitle && (
            <p className="text-xs opacity-90 mb-3 line-clamp-1">
              {settings.hero_subtitle}
            </p>
          )}
          <div className="flex gap-2 justify-center">
            <Button size="sm" className="bg-white text-black hover:bg-gray-100 text-xs px-2 py-1">
              {settings.hero_button_primary_text || 'Principal'}
            </Button>
            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-xs px-2 py-1">
              {settings.hero_button_secondary_text || 'Secundário'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RealTimeHeroPreview;