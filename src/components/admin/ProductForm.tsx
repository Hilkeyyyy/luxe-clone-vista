
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProductFormProps } from './product-form/ProductFormTypes';
import { useProductForm } from './product-form/useProductForm';

// Componentes refatorados
import BasicProductInfo from './product-form/BasicProductInfo';
import ProductPricing from './product-form/ProductPricing';
import ProductDescription from './product-form/ProductDescription';
import ProductStatus from './product-form/ProductStatus';
import ProductSpecifications from './product-form/ProductSpecifications';
import ProductGallery from './product-form/ProductGallery';
import ImageUpload from './product-form/ImageUpload';

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    formData,
    errors,
    updateBasicField,
    updatePricingField,
    updateStatusField,
    updateSpecification,
    updateImages,
    addColor,
    removeColor,
    addSize,
    removeSize,
    validateForm,
    getCleanedData
  } = useProductForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(getCleanedData());
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
          onUpdate={updateBasicField}
        />

        {/* Preços */}
        <ProductPricing
          price={formData.price}
          original_price={formData.original_price}
          onUpdate={updatePricingField}
        />
      </div>

      {/* Upload de Imagens */}
      <ImageUpload
        images={formData.images}
        onImagesChange={updateImages}
      />

      {/* Descrição */}
      <ProductDescription
        description={formData.description}
        onUpdate={updateBasicField}
      />

      {/* Status e Etiquetas */}
      <ProductStatus
        is_featured={formData.is_featured}
        is_new={formData.is_new}
        is_bestseller={formData.is_bestseller}
        is_sold_out={formData.is_sold_out}
        is_coming_soon={formData.is_coming_soon}
        custom_badge={formData.custom_badge}
        onUpdate={updateStatusField}
      />

      {/* Especificações Técnicas */}
      <ProductSpecifications
        movement={formData.movement}
        diameter={formData.diameter}
        material={formData.material}
        water_resistance={formData.water_resistance}
        specifications={formData.specifications}
        onUpdate={updateBasicField}
        onSpecificationUpdate={updateSpecification}
      />

      {/* Cores e Tamanhos */}
      <ProductGallery
        colors={formData.colors}
        sizes={formData.sizes}
        images={[]}
        onAddColor={addColor}
        onRemoveColor={removeColor}
        onAddSize={addSize}
        onRemoveSize={removeSize}
        onAddImage={() => {}}
        onRemoveImage={() => {}}
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
