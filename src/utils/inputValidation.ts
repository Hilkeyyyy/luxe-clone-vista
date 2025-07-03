
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Validação aprimorada para diferentes tipos de entrada
export const sanitizeInput = (input: string, type: 'text' | 'html' | 'url' = 'text'): string => {
  if (!input) return '';
  
  switch (type) {
    case 'html':
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
        ALLOWED_ATTR: []
      });
    case 'url':
      try {
        const url = new URL(input);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return '';
        }
        return url.toString();
      } catch {
        return '';
      }
    default:
      return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .replace(/javascript:/gi, '')
                  .replace(/on\w+\s*=/gi, '');
  }
};

// Schemas de validação atualizados com limites de segurança
export const secureProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  brand: z.string().min(1, 'Marca é obrigatória').max(50, 'Marca muito longa'),
  category: z.string().min(1, 'Categoria é obrigatória').max(50, 'Categoria muito longa'),
  clone_category: z.string().max(50, 'Categoria clone muito longa').nullable().optional(),
  price: z.number().min(0, 'Preço deve ser positivo').max(999999, 'Preço muito alto'),
  original_price: z.number().min(0).max(999999, 'Preço original muito alto').nullable().optional(),
  description: z.string().max(2000, 'Descrição muito longa').nullable().optional(),
  images: z.array(z.string().url('URL de imagem inválida')).max(10, 'Muitas imagens'),
  colors: z.array(z.string().max(30, 'Nome da cor muito longo')).max(20, 'Muitas cores'),
  sizes: z.array(z.string().max(20, 'Tamanho muito longo')).max(20, 'Muitos tamanhos'),
  custom_badge: z.string().max(20, 'Badge muito longo').nullable().optional(),
  movement: z.string().max(50, 'Movimento muito longo').nullable().optional(),
  diameter: z.string().max(20, 'Diâmetro muito longo').nullable().optional(),
  material: z.string().max(50, 'Material muito longo').nullable().optional(),
  water_resistance: z.string().max(30, 'Resistência à água muito longa').nullable().optional()
});

export const validateAndSanitizeProduct = (data: any) => {
  // Sanitizar strings
  const sanitizedData = {
    ...data,
    name: sanitizeInput(data.name || ''),
    brand: sanitizeInput(data.brand || ''),
    category: sanitizeInput(data.category || ''),
    description: data.description ? sanitizeInput(data.description, 'html') : null,
    custom_badge: data.custom_badge ? sanitizeInput(data.custom_badge) : null,
    movement: data.movement ? sanitizeInput(data.movement) : null,
    diameter: data.diameter ? sanitizeInput(data.diameter) : null,
    material: data.material ? sanitizeInput(data.material) : null,
    water_resistance: data.water_resistance ? sanitizeInput(data.water_resistance) : null,
    clone_category: data.clone_category || 'Clone'
  };

  return secureProductSchema.parse(sanitizedData);
};

// Validação para configurações de admin
export const adminSettingsSchema = z.object({
  whatsapp_number: z.string().regex(/^\+?[\d\s\-\(\)]{10,20}$/, 'Número de WhatsApp inválido'),
  company_name: z.string().min(1, 'Nome da empresa obrigatório').max(100, 'Nome muito longo'),
  company_phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,20}$/, 'Telefone inválido'),
  company_email: z.string().email('Email inválido').max(100, 'Email muito longo')
});
