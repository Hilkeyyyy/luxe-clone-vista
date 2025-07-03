
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Sanitizar HTML
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: []
  });
};

// Sanitizar URL
export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    // Permitir apenas HTTP e HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Protocol not allowed');
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
};

// Schema de validação para produtos - CORRIGIDO para aceitar valores nulos
export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  brand: z.string().min(1, 'Marca é obrigatória').max(100),
  category: z.string().min(1, 'Categoria é obrigatória').max(100),
  clone_category: z.string().nullable().optional(),
  price: z.number().min(0, 'Preço deve ser positivo'),
  original_price: z.number().min(0).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  images: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_sold_out: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  is_coming_soon: z.boolean().default(false),
  custom_badge: z.string().nullable().optional(),
  movement: z.string().nullable().optional(),
  diameter: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  water_resistance: z.string().nullable().optional(),
  specifications: z.record(z.string()).nullable().optional()
});

export const validateProductData = (data: any) => {
  return productSchema.parse(data);
};

export const sanitizeProductData = (data: any) => {
  return {
    ...data,
    name: sanitizeHtml(data.name || ''),
    brand: sanitizeHtml(data.brand || ''),
    category: sanitizeHtml(data.category || ''),
    description: data.description ? sanitizeHtml(data.description) : null,
    custom_badge: data.custom_badge ? sanitizeHtml(data.custom_badge) : null,
    movement: data.movement ? sanitizeHtml(data.movement) : null,
    diameter: data.diameter ? sanitizeHtml(data.diameter) : null,
    material: data.material ? sanitizeHtml(data.material) : null,
    water_resistance: data.water_resistance ? sanitizeHtml(data.water_resistance) : null,
    clone_category: data.clone_category || 'Clone'
  };
};

// Rate limiting simples
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests = 5;
  private windowMs = 60000; // 1 minuto

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remover requests antigas
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return true;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return false;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
