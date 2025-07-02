
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  clone_category: string;
  price: number;
  original_price?: number;
  description?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  is_featured?: boolean;
  is_new?: boolean;
  is_sold_out?: boolean;
  is_bestseller?: boolean;
  is_coming_soon?: boolean;
  custom_badge?: string;
  movement?: string;
  diameter?: string;
  material?: string;
  water_resistance?: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CLONE_CATEGORIES = ['ETA Básico', 'Clone', 'Super Clone'];
const STATUS_OPTIONS = [
  { value: 'is_new', label: 'Novidade' },
  { value: 'is_bestseller', label: 'Mais Vendido' },
  { value: 'is_sold_out', label: 'Esgotado' },
  { value: 'is_coming_soon', label: 'Em Breve' },
];

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    category: '',
    clone_category: 'Clone',
    price: 0,
    original_price: 0,
    description: '',
    images: [],
    colors: [],
    sizes: [],
    is_featured: false,
    is_new: false,
    is_sold_out: false,
    is_bestseller: false,
    is_coming_soon: false,
    custom_badge: '',
    movement: '',
    diameter: '',
    material: '',
    water_resistance: '',
    ...initialData
  });

  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }));
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [status]: checked
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                placeholder="Ex: Rolex, Omega, Cartier..."
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
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
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="clone_category">Tipo de Relógio *</Label>
              <Select
                value={formData.clone_category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, clone_category: value }))}
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

        {/* Preços */}
        <Card>
          <CardHeader>
            <CardTitle>Preços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Preço Atual (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="original_price">Preço Original (R$)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                value={formData.original_price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseFloat(e.target.value) || undefined }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descrição */}
      <Card>
        <CardHeader>
          <CardTitle>Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Descrição detalhada do produto..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Status e Etiquetas */}
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
                  checked={formData[option.value as keyof ProductFormData] as boolean}
                  onCheckedChange={(checked) => handleStatusChange(option.value, checked as boolean)}
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
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked as boolean }))}
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
              value={formData.custom_badge}
              onChange={(e) => setFormData(prev => ({ ...prev, custom_badge: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Especificações Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>Especificações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="movement">Movimento</Label>
            <Input
              id="movement"
              placeholder="Ex: Automático, Quartzo..."
              value={formData.movement}
              onChange={(e) => setFormData(prev => ({ ...prev, movement: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="diameter">Diâmetro</Label>
            <Input
              id="diameter"
              placeholder="Ex: 40mm, 42mm..."
              value={formData.diameter}
              onChange={(e) => setFormData(prev => ({ ...prev, diameter: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              placeholder="Ex: Aço Inoxidável, Ouro..."
              value={formData.material}
              onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="water_resistance">Resistência à Água</Label>
            <Input
              id="water_resistance"
              placeholder="Ex: 30m, 100m, 300m..."
              value={formData.water_resistance}
              onChange={(e) => setFormData(prev => ({ ...prev, water_resistance: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cores */}
      <Card>
        <CardHeader>
          <CardTitle>Cores Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite uma cor..."
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            />
            <Button type="button" onClick={addColor} size="sm">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.colors.map(color => (
              <Badge key={color} variant="secondary" className="flex items-center space-x-1">
                <span>{color}</span>
                <button type="button" onClick={() => removeColor(color)}>
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tamanhos */}
      <Card>
        <CardHeader>
          <CardTitle>Tamanhos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite um tamanho..."
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            />
            <Button type="button" onClick={addSize} size="sm">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.sizes.map(size => (
              <Badge key={size} variant="secondary" className="flex items-center space-x-1">
                <span>{size}</span>
                <button type="button" onClick={() => removeSize(size)}>
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="URL da imagem..."
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            />
            <Button type="button" onClick={addImage} size="sm">
              <Plus size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Produto ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex space-x-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
