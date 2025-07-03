
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ProductGalleryProps {
  colors: string[];
  sizes: string[];
  images: string[]; // Mantido para compatibilidade mas não usado
  onAddColor: (color: string) => void;
  onRemoveColor: (color: string) => void;
  onAddSize: (size: string) => void;
  onRemoveSize: (size: string) => void;
  onAddImage: (image: string) => void; // Mantido para compatibilidade
  onRemoveImage: (image: string) => void; // Mantido para compatibilidade
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  colors,
  sizes,
  onAddColor,
  onRemoveColor,
  onAddSize,
  onRemoveSize,
}) => {
  const [newColor, setNewColor] = React.useState('');
  const [newSize, setNewSize] = React.useState('');

  const handleAddColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      onAddColor(newColor.trim());
      setNewColor('');
    }
  };

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      onAddSize(newSize.trim());
      setNewSize('');
    }
  };

  return (
    <>
      {/* Cores - Opcional */}
      <Card>
        <CardHeader>
          <CardTitle>Cores Disponíveis (opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite uma cor..."
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
            />
            <Button type="button" onClick={handleAddColor} size="sm">
              <Plus size={16} />
            </Button>
          </div>
          {colors && colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <Badge key={color} variant="secondary" className="flex items-center space-x-1">
                  <span>{color}</span>
                  <button type="button" onClick={() => onRemoveColor(color)}>
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tamanhos - Opcional */}
      <Card>
        <CardHeader>
          <CardTitle>Tamanhos Disponíveis (opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite um tamanho..."
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
            />
            <Button type="button" onClick={handleAddSize} size="sm">
              <Plus size={16} />
            </Button>
          </div>
          {sizes && sizes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <Badge key={size} variant="secondary" className="flex items-center space-x-1">
                  <span>{size}</span>
                  <button type="button" onClick={() => onRemoveSize(size)}>
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ProductGallery;
