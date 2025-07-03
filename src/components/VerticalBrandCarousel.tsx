
import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useBrandCategories } from '@/hooks/useBrandCategories';

const VerticalBrandCarousel = () => {
  const { categories, loading } = useBrandCategories(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (categories.length === 0) return;
    
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [categories.length, isDragging]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    if (Math.abs(info.offset.y) > 50) {
      if (info.offset.y > 0) {
        // Dragged down - go to previous
        setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
      } else {
        // Dragged up - go to next
        setCurrentIndex((prev) => (prev + 1) % categories.length);
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  if (loading || !categories.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden" ref={containerRef}>
      <motion.div
        className="flex flex-col h-full"
        animate={{ y: -currentIndex * 100 + '%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragElastic={0.1}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="w-full h-full flex-shrink-0 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {category.image_url ? (
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-400 flex items-center justify-center">
                <span className="text-8xl font-bold text-neutral-600 font-outfit opacity-50">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Subtle overlay for better visibility */}
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {categories.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Drag Indicator */}
      {categories.length > 1 && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center space-y-2 text-white/70 z-10">
          <motion.div
            className="w-1 h-8 bg-white/30 rounded-full"
            animate={{ height: isDragging ? 12 : 32 }}
            transition={{ duration: 0.2 }}
          />
          <div className="text-xs font-outfit rotate-90 whitespace-nowrap">
            Arraste
          </div>
        </div>
      )}
    </div>
  );
};

export default VerticalBrandCarousel;
