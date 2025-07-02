
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CurrencyInput } from '@/components/ui/currency-input';

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
          <Label htmlFor="price">Preço Atual *</Label>
          <CurrencyInput
            value={price}
            onChange={(value) => onUpdate('price', value)}
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <Label htmlFor="original_price">Preço Original</Label>
          <CurrencyInput
            value={original_price}
            onChange={(value) => onUpdate('original_price', value)}
            placeholder="R$ 0,00"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPricing;
