
import React from 'react';
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
  const cloneTypes = [
    { value: 'ETA Base', label: 'ETA Base' },
    { value: 'Clone', label: 'Clone' },
    { value: 'Super Clone', label: 'Super Clone' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Ex: Submariner Date 40mm"
          />
        </div>

        <div>
          <Label htmlFor="brand">Marca *</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => onUpdate('brand', e.target.value)}
            placeholder="Ex: Rolex, Patek Philippe, Omega..."
          />
          <p className="text-xs text-neutral-500 mt-1">
            A categoria será criada automaticamente baseada na marca
          </p>
        </div>

        <div>
          <Label htmlFor="category">Categoria do Produto *</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => onUpdate('category', e.target.value)}
            placeholder="Ex: Relógio de Pulso, Cronógrafo..."
          />
        </div>

        <div>
          <Label htmlFor="clone_category">Tipo de Relógio *</Label>
          <Select value={clone_category} onValueChange={(value) => onUpdate('clone_category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {cloneTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-500 mt-1">
            Define a qualidade e tipo do movimento
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicProductInfo;
