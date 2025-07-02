
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ProductDescriptionProps {
  description?: string;
  onUpdate: (field: string, value: string) => void;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  onUpdate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Descrição</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Descrição detalhada do produto..."
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

export default ProductDescription;
