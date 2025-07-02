
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CurrencyInput } from '@/components/ui/currency-input';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface WatchSpecifications {
  // Informações Básicas
  modelo?: string;
  linha?: string;
  referencia?: string;
  
  // Caixa
  formato_caixa?: string;
  espessura?: string;
  cor_caixa?: string;
  acabamento_caixa?: string;
  tipo_vidro?: string;
  
  // Mostrador
  cor_mostrador?: string;
  tipo_indices?: string;
  subdials?: string;
  data?: string;
  gmt?: string;
  
  // Pulseira/Correia
  tipo_pulseira?: string;
  material_pulseira?: string;
  cor_pulseira?: string;
  tipo_fecho?: string;
  comprimento_pulseira?: string;
  
  // Movimento
  calibre?: string;
  frequencia?: string;
  reserva_marcha?: string;
  joias?: string;
  certificacao_movimento?: string;
  
  // Funções Especiais
  cronografo?: string;
  alarme?: string;
  bussola?: string;
  calculadora?: string;
  taquimetro?: string;
  telemetro?: string;
  
  // Resistências
  choque?: string;
  magnetismo?: string;
  temperatura?: string;
  
  // Certificações
  cosc?: string;
  teste_marca?: string;
  garantia?: string;
}

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
  specifications?: WatchSpecifications;
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
    specifications: {},
    ...initialData
  });

  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newImage, setNewImage] = useState('');
  const [specsOpen, setSpecsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Garantir que arrays não sejam null
    const cleanedData = {
      ...formData,
      colors: formData.colors || [],
      sizes: formData.sizes || [],
      images: formData.images || [],
      specifications: formData.specifications || {}
    };
    
    await onSubmit(cleanedData);
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), newColor.trim()]
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c !== color)
    }));
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...(prev.sizes || []), newSize.trim()]
      }));
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: (prev.sizes || []).filter(s => s !== size)
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter(img => img !== image)
    }));
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [status]: checked
    }));
  };

  const updateSpecification = (key: keyof WatchSpecifications, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value || undefined
      }
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
              <Label htmlFor="price">Preço Atual *</Label>
              <CurrencyInput
                value={formData.price}
                onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <Label htmlFor="original_price">Preço Original</Label>
              <CurrencyInput
                value={formData.original_price}
                onChange={(value) => setFormData(prev => ({ ...prev, original_price: value }))}
                placeholder="R$ 0,00"
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

      {/* Especificações Técnicas Expandidas */}
      <Card>
        <CardHeader>
          <CardTitle>Especificações Técnicas Básicas</CardTitle>
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

      {/* Especificações Avançadas - Collapsible */}
      <Card>
        <Collapsible open={specsOpen} onOpenChange={setSpecsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <CardTitle>Especificações Avançadas (Opcional)</CardTitle>
                {specsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Informações do Modelo */}
              <div>
                <h4 className="font-semibold mb-3">Informações do Modelo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Modelo</Label>
                    <Input
                      placeholder="Ex: Submariner, Speedmaster..."
                      value={formData.specifications?.modelo || ''}
                      onChange={(e) => updateSpecification('modelo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Linha</Label>
                    <Input
                      placeholder="Ex: Professional, GMT-Master..."
                      value={formData.specifications?.linha || ''}
                      onChange={(e) => updateSpecification('linha', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Referência</Label>
                    <Input
                      placeholder="Ex: 116610LN, 311.30.42.30..."
                      value={formData.specifications?.referencia || ''}
                      onChange={(e) => updateSpecification('referencia', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Especificações da Caixa */}
              <div>
                <h4 className="font-semibold mb-3">Caixa</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Formato da Caixa</Label>
                    <Input
                      placeholder="Ex: Redonda, Quadrada, Retangular..."
                      value={formData.specifications?.formato_caixa || ''}
                      onChange={(e) => updateSpecification('formato_caixa', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Espessura</Label>
                    <Input
                      placeholder="Ex: 12mm, 15mm..."
                      value={formData.specifications?.espessura || ''}
                      onChange={(e) => updateSpecification('espessura', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Cor da Caixa</Label>
                    <Input
                      placeholder="Ex: Prata, Dourada, Preta..."
                      value={formData.specifications?.cor_caixa || ''}
                      onChange={(e) => updateSpecification('cor_caixa', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Acabamento da Caixa</Label>
                    <Input
                      placeholder="Ex: Polido, Escovado, PVD..."
                      value={formData.specifications?.acabamento_caixa || ''}
                      onChange={(e) => updateSpecification('acabamento_caixa', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tipo de Vidro</Label>
                    <Input
                      placeholder="Ex: Safira, Mineral, Acrílico..."
                      value={formData.specifications?.tipo_vidro || ''}
                      onChange={(e) => updateSpecification('tipo_vidro', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Especificações do Mostrador */}
              <div>
                <h4 className="font-semibold mb-3">Mostrador</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Cor do Mostrador</Label>
                    <Input
                      placeholder="Ex: Preto, Branco, Azul..."
                      value={formData.specifications?.cor_mostrador || ''}
                      onChange={(e) => updateSpecification('cor_mostrador', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tipo de Índices</Label>
                    <Input
                      placeholder="Ex: Aplicados, Impressos, Luminosos..."
                      value={formData.specifications?.tipo_indices || ''}
                      onChange={(e) => updateSpecification('tipo_indices', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Subdials</Label>
                    <Input
                      placeholder="Ex: 3 subdials, Cronógrafo..."
                      value={formData.specifications?.subdials || ''}
                      onChange={(e) => updateSpecification('subdials', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Exibição de Data</Label>
                    <Input
                      placeholder="Ex: 3h, 6h, Sem data..."
                      value={formData.specifications?.data || ''}
                      onChange={(e) => updateSpecification('data', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>GMT</Label>
                    <Input
                      placeholder="Ex: Ponteiro GMT, Bezel GMT..."
                      value={formData.specifications?.gmt || ''}
                      onChange={(e) => updateSpecification('gmt', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Pulseira/Correia */}
              <div>
                <h4 className="font-semibold mb-3">Pulseira/Correia</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <Input
                      placeholder="Ex: Pulseira, Correia..."
                      value={formData.specifications?.tipo_pulseira || ''}
                      onChange={(e) => updateSpecification('tipo_pulseira', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Material da Pulseira</Label>
                    <Input
                      placeholder="Ex: Aço, Couro, Borracha..."
                      value={formData.specifications?.material_pulseira || ''}
                      onChange={(e) => updateSpecification('material_pulseira', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Cor da Pulseira</Label>
                    <Input
                      placeholder="Ex: Prata, Marrom, Preta..."
                      value={formData.specifications?.cor_pulseira || ''}
                      onChange={(e) => updateSpecification('cor_pulseira', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tipo de Fecho</Label>
                    <Input
                      placeholder="Ex: Fivela, Deployant, Oysterlock..."
                      value={formData.specifications?.tipo_fecho || ''}
                      onChange={(e) => updateSpecification('tipo_fecho', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Comprimento</Label>
                    <Input
                      placeholder="Ex: 18-22cm, Ajustável..."
                      value={formData.specifications?.comprimento_pulseira || ''}
                      onChange={(e) => updateSpecification('comprimento_pulseira', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Movimento Detalhado */}
              <div>
                <h4 className="font-semibold mb-3">Movimento Detalhado</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Calibre</Label>
                    <Input
                      placeholder="Ex: 2824-2, 7750, Miyota 9015..."
                      value={formData.specifications?.calibre || ''}
                      onChange={(e) => updateSpecification('calibre', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Frequência</Label>
                    <Input
                      placeholder="Ex: 28.800 vph, 21.600 vph..."
                      value={formData.specifications?.frequencia || ''}
                      onChange={(e) => updateSpecification('frequencia', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Reserva de Marcha</Label>
                    <Input
                      placeholder="Ex: 42h, 72h, 120h..."
                      value={formData.specifications?.reserva_marcha || ''}
                      onChange={(e) => updateSpecification('reserva_marcha', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Joias</Label>
                    <Input
                      placeholder="Ex: 25 joias, 31 joias..."
                      value={formData.specifications?.joias || ''}
                      onChange={(e) => updateSpecification('joias', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Certificação do Movimento</Label>
                    <Input
                      placeholder="Ex: COSC, Manufatura..."
                      value={formData.specifications?.certificacao_movimento || ''}
                      onChange={(e) => updateSpecification('certificacao_movimento', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Funções Especiais */}
              <div>
                <h4 className="font-semibold mb-3">Funções Especiais</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Cronógrafo</Label>
                    <Input
                      placeholder="Ex: 1/10s, 30 min, 12h..."
                      value={formData.specifications?.cronografo || ''}
                      onChange={(e) => updateSpecification('cronografo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Alarme</Label>
                    <Input
                      placeholder="Ex: Alarme simples, Dual time..."
                      value={formData.specifications?.alarme || ''}
                      onChange={(e) => updateSpecification('alarme', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Bússola</Label>
                    <Input
                      placeholder="Ex: Digital, Analógica..."
                      value={formData.specifications?.bussola || ''}
                      onChange={(e) => updateSpecification('bussola', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Calculadora</Label>
                    <Input
                      placeholder="Ex: Régua de cálculo, Digital..."
                      value={formData.specifications?.calculadora || ''}
                      onChange={(e) => updateSpecification('calculadora', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Taquímetro</Label>
                    <Input
                      placeholder="Ex: Escala 400, Bezel externo..."
                      value={formData.specifications?.taquimetro || ''}
                      onChange={(e) => updateSpecification('taquimetro', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Telémetro</Label>
                    <Input
                      placeholder="Ex: Escala 1000m, Interno..."
                      value={formData.specifications?.telemetro || ''}
                      onChange={(e) => updateSpecification('telemetro', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Resistências */}
              <div>
                <h4 className="font-semibold mb-3">Resistências</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Resistência a Choques</Label>
                    <Input
                      placeholder="Ex: ISO 1413, Militar..."
                      value={formData.specifications?.choque || ''}
                      onChange={(e) => updateSpecification('choque', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Resistência Magnética</Label>
                    <Input
                      placeholder="Ex: 4.800 A/m, Antimagnético..."
                      value={formData.specifications?.magnetismo || ''}
                      onChange={(e) => updateSpecification('magnetismo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Resistência à Temperatura</Label>
                    <Input
                      placeholder="Ex: -10°C a +60°C..."
                      value={formData.specifications?.temperatura || ''}
                      onChange={(e) => updateSpecification('temperatura', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Certificações e Garantia */}
              <div>
                <h4 className="font-semibold mb-3">Certificações e Garantia</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Certificação COSC</Label>
                    <Input
                      placeholder="Ex: Sim, Não, Cronômetro..."
                      value={formData.specifications?.cosc || ''}
                      onChange={(e) => updateSpecification('cosc', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Teste da Marca</Label>
                    <Input
                      placeholder="Ex: Master Chronometer, Superlative..."
                      value={formData.specifications?.teste_marca || ''}
                      onChange={(e) => updateSpecification('teste_marca', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Garantia</Label>
                    <Input
                      placeholder="Ex: 2 anos, 5 anos..."
                      value={formData.specifications?.garantia || ''}
                      onChange={(e) => updateSpecification('garantia', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Cores - Agora Opcional */}
      {(formData.colors && formData.colors.length > 0) || newColor ? (
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
            {formData.colors && formData.colors.length > 0 && (
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
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-4 border-2 border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-600 text-sm mb-2">Adicionar cores do produto</p>
          <div className="flex justify-center space-x-2 max-w-sm mx-auto">
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
        </div>
      )}

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
