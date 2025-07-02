
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STATUS_OPTIONS = [
  { value: 'is_new', label: 'Novidade' },
  { value: 'is_bestseller', label: 'Mais Vendido' },
  { value: 'is_sold_out', label: 'Esgotado' },
  { value: 'is_coming_soon', label: 'Em Breve' },
];

interface ProductStatusProps {
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  is_sold_out?: boolean;
  is_coming_soon?: boolean;
  custom_badge?: string;
  onUpdate: (field: string, value: boolean | string) => void;
}

const ProductStatus: React.FC<ProductStatusProps> = ({
  is_featured,
  is_new,
  is_bestseller,
  is_sold_out,
  is_coming_soon,
  custom_badge,
  onUpdate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Produto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATUS_OPTIONS.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={
                  option.value === 'is_new' ? is_new :
                  option.value === 'is_bestseller' ? is_bestseller :
                  option.value === 'is_sold_out' ? is_sold_out :
                  is_coming_soon
                }
                onCheckedChange={(checked) => onUpdate(option.value, checked as boolean)}
              />
              <Label htmlFor={option.value} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_featured"
            checked={is_featured}
            onCheckedChange={(checked) => onUpdate('is_featured', checked as boolean)}
          />
          <Label htmlFor="is_featured" className="text-sm">
            Produto em Destaque
          </Label>
        </div>

        <div>
          <Label htmlFor="custom_badge">Etiqueta Personalizada</Label>
          <Input
            id="custom_badge"
            placeholder="Digite uma etiqueta personalizada..."
            value={custom_badge}
            onChange={(e) => onUpdate('custom_badge', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductStatus;
