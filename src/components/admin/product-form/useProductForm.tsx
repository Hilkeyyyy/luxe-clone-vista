
import { useState } from 'react';
import { ProductFormData, WatchSpecifications } from './ProductFormTypes';

export const useProductForm = (initialData: Partial<ProductFormData> = {}) => {
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

  const updateBasicField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const updatePricingField = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const updateStatusField = (field: string, value: boolean | string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const updateImages = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const addColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: [...(prev.colors || []), color]
    }));
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c !== color)
    }));
  };

  const addSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: [...(prev.sizes || []), size]
    }));
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: (prev.sizes || []).filter(s => s !== size)
    }));
  };

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

  const getCleanedData = () => {
    return {
      ...formData,
      colors: formData.colors || [],
      sizes: formData.sizes || [],
      images: formData.images || [],
      specifications: formData.specifications || {}
    };
  };

  return {
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
  };
};
