
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CLONE_CATEGORIES = ['ETA Básico', 'Clone', 'Super Clone'];

interface BasicProductInfoProps {
  name: string;
  brand: string;
  category: string;
  clone_category: string;
  onUpdate: (field: string, value: string) => void;
}

const BasicProductInfo: React.FC<BasicProductInfoProps> = ({
  name,
  brand,
  category,
  clone_category,
  onUpdate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onUpdate('name', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="brand">Marca *</Label>
          <Input
            id="brand"
            placeholder="Ex: Rolex, Omega, Cartier..."
            value={brand}
            onChange={(e) => onUpdate('brand', e.target.value)}
            required
          />
          <p className="text-xs text-neutral-500 mt-1">
            Se a marca não existir, será criada automaticamente
          </p>
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            placeholder="Ex: Relógio de Pulso, Cronógrafo..."
            value={category}
            onChange={(e) => onUpdate('category', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="clone_category">Tipo de Relógio *</Label>
          <Select
            value={clone_category}
            onValueChange={(value) => onUpdate('clone_category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLONE_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicProductInfo;
