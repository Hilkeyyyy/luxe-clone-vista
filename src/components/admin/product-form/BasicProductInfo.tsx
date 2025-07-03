
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
          <Label htmlFor="name" className="text-sm font-medium">
            Nome do Produto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Ex: Rolex GMT-Master II 116710LN"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="brand" className="text-sm font-medium">
            Marca <span className="text-red-500">*</span>
          </Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => onUpdate('brand', e.target.value)}
            placeholder="Ex: Rolex"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-sm font-medium">
            Categoria <span className="text-red-500">*</span>
          </Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => onUpdate('category', e.target.value)}
            placeholder="Ex: Relógios"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="clone_category" className="text-sm font-medium">
            Tipo de Clone
          </Label>
          <Select value={clone_category} onValueChange={(value) => onUpdate('clone_category', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Clone">Clone</SelectItem>
              <SelectItem value="Super Clone">Super Clone</SelectItem>
              <SelectItem value="ETA Básico">ETA Básico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicProductInfo;
