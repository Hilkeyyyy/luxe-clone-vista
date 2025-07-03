
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { sanitizeHtml } from '@/utils/security';

interface ProductDescriptionProps {
  description?: string;
  onUpdate: (field: string, value: string) => void;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  onUpdate
}) => {
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Limitar tamanho da descrição
    if (value.length <= 5000) {
      onUpdate('description', value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Descrição</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Descrição detalhada do produto..."
          value={description || ''}
          onChange={handleDescriptionChange}
          rows={4}
          maxLength={5000}
        />
        <p className="text-xs text-neutral-500 mt-1">
          {(description || '').length}/5000 caracteres
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductDescription;
