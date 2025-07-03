import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Componentes refatorados
import BasicProductInfo from './product-form/BasicProductInfo';
import ProductPricing from './product-form/ProductPricing';
import ProductDescription from './product-form/ProductDescription';
import ProductStatus from './product-form/ProductStatus';
import ProductSpecifications from './product-form/ProductSpecifications';
import ProductGallery from './product-form/ProductGallery';
import ImageUpload from './product-form/ImageUpload';

interface WatchSpecifications {
  modelo?: string;
  linha?: string;
  referencia?: string;
  formato_caixa?: string;
  espessura?: string;
  cor_caixa?: string;
  acabamento_caixa?: string;
  tipo_vidro?: string;
  cor_mostrador?: string;
  tipo_indices?: string;
  subdials?: string;
  data?: string;
  gmt?: string;
  tipo_pulseira?: string;
  material_pulseira?: string;
  cor_pulseira?: string;
  tipo_fecho?: string;
  comprimento_pulseira?: string;
  calibre?: string;
  frequencia?: string;
  reserva_marcha?: string;
  joias?: string;
  certificacao_movimento?: string;
  cronografo?: string;
  alarme?: string;
  bussola?: string;
  calculadora?: string;
  taquimetro?: string;
  telemetro?: string;
  choque?: string;
  magnetismo?: string;
  temperatura?: string;
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

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('Nome do produto é obrigatório');
    if (!formData.brand.trim()) newErrors.push('Marca é obrigatória');
    if (!formData.category.trim()) newErrors.push('Categoria é obrigatória');
    if (!formData.price || formData.price <= 0) newErrors.push('Preço deve ser maior que zero');
    if (!formData.images || formData.images.length === 0) newErrors.push('Pelo menos uma imagem é obrigatória');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Garantir que arrays não sejam null e limpar dados
    const cleanedData = {
      ...formData,
      colors: formData.colors || [],
      sizes: formData.sizes || [],
      images: formData.images || [],
      specifications: formData.specifications || {}
    };
    
    await onSubmit(cleanedData);
  };

  const handleBasicUpdate = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erros relacionados ao campo
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handlePricingUpdate = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleStatusUpdate = (field: string, value: boolean | string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecificationUpdate = (key: keyof WatchSpecifications, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value || undefined
      }
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Handlers para cores
  const handleAddColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: [...(prev.colors || []), color]
    }));
  };

  const handleRemoveColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c !== color)
    }));
  };

  // Handlers para tamanhos
  const handleAddSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: [...(prev.sizes || []), size]
    }));
  };

  const handleRemoveSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: (prev.sizes || []).filter(s => s !== size)
    }));
  };

  // Handlers para imagens
  const handleAddImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), image]
    }));
  };

  const handleRemoveImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter(img => img !== image)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mostrar erros */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <BasicProductInfo
          name={formData.name}
          brand={formData.brand}
          category={formData.category}
          clone_category={formData.clone_category}
          onUpdate={handleBasicUpdate}
        />

        {/* Preços */}
        <ProductPricing
          price={formData.price}
          original_price={formData.original_price}
          onUpdate={handlePricingUpdate}
        />
      </div>

      {/* Upload de Imagens */}
      <ImageUpload
        images={formData.images}
        onImagesChange={handleImagesChange}
      />

      {/* Descrição */}
      <ProductDescription
        description={formData.description}
        onUpdate={handleBasicUpdate}
      />

      {/* Status e Etiquetas */}
      <ProductStatus
        is_featured={formData.is_featured}
        is_new={formData.is_new}
        is_bestseller={formData.is_bestseller}
        is_sold_out={formData.is_sold_out}
        is_coming_soon={formData.is_coming_soon}
        custom_badge={formData.custom_badge}
        onUpdate={handleStatusUpdate}
      />

      {/* Especificações Técnicas - Agora Opcionais */}
      <ProductSpecifications
        movement={formData.movement}
        diameter={formData.diameter}
        material={formData.material}
        water_resistance={formData.water_resistance}
        specifications={formData.specifications}
        onUpdate={handleBasicUpdate}
        onSpecificationUpdate={handleSpecificationUpdate}
      />

      {/* Cores e Tamanhos */}
      <ProductGallery
        colors={formData.colors}
        sizes={formData.sizes}
        images={[]} // Não usado mais
        onAddColor={handleAddColor}
        onRemoveColor={handleRemoveColor}
        onAddSize={handleAddSize}
        onRemoveSize={handleRemoveSize}
        onAddImage={() => {}} // Não usado mais
        onRemoveImage={() => {}} // Não usado mais
      />

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
