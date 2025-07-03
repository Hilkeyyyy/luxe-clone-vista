
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductPricingProps {
  price: number;
  original_price?: number;
  onUpdate: (field: string, value: number) => void;
}

const ProductPricing: React.FC<ProductPricingProps> = ({
  price,
  original_price,
  onUpdate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preços</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="price" className="text-sm font-medium">
            Preço de Venda <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            value={price || ''}
            onChange={(e) => onUpdate('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="original_price" className="text-sm font-medium">
            Preço Original (opcional)
          </Label>
          <Input
            id="original_price"
            type="number"
            value={original_price || ''}
            onChange={(e) => onUpdate('original_price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="mt-1"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Apenas preencha se o produto estiver em promoção
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPricing;
