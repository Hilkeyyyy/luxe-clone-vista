
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Configuração do DOMPurify para sanitização
const purifyConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
};

/**
 * Sanitiza HTML para prevenir XSS
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, purifyConfig);
};

/**
 * Valida e sanitiza URLs
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const parsedUrl = new URL(url);
    // Permitir apenas HTTP e HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
};

/**
 * Schema de validação para produtos
 */
export const productValidationSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome não pode exceder 200 caracteres')
    .trim(),
  brand: z.string()
    .min(1, 'Marca é obrigatória')
    .max(100, 'Marca não pode exceder 100 caracteres')
    .trim(),
  category: z.string()
    .max(100, 'Categoria não pode exceder 100 caracteres')
    .trim(),
  clone_category: z.string()
    .min(1, 'Tipo de relógio é obrigatório'),
  price: z.number()
    .min(0, 'Preço deve ser positivo')
    .max(999999.99, 'Preço muito alto'),
  original_price: z.number()
    .min(0, 'Preço original deve ser positivo')
    .max(999999.99, 'Preço original muito alto')
    .optional(),
  description: z.string()
    .max(5000, 'Descrição não pode exceder 5000 caracteres')
    .optional(),
  images: z.array(z.string().url('URL de imagem inválida'))
    .max(10, 'Máximo de 10 imagens'),
  colors: z.array(z.string().max(50, 'Nome da cor muito longo'))
    .max(20, 'Máximo de 20 cores'),
  sizes: z.array(z.string().max(50, 'Tamanho muito longo'))
    .max(20, 'Máximo de 20 tamanhos'),
  movement: z.string()
    .max(100, 'Movimento não pode exceder 100 caracteres')
    .optional(),
  diameter: z.string()
    .max(50, 'Diâmetro não pode exceder 50 caracteres')
    .optional(),
  material: z.string()
    .max(100, 'Material não pode exceder 100 caracteres')
    .optional(),
  water_resistance: z.string()
    .max(50, 'Resistência à água não pode exceder 50 caracteres')
    .optional(),
  custom_badge: z.string()
    .max(50, 'Badge personalizado não pode exceder 50 caracteres')
    .optional(),
});

/**
 * Valida dados do produto
 */
export const validateProductData = (data: any) => {
  try {
    return productValidationSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

/**
 * Sanitiza dados do produto antes de salvar
 */
export const sanitizeProductData = (data: any) => {
  return {
    ...data,
    name: sanitizeHtml(data.name?.toString() || ''),
    brand: sanitizeHtml(data.brand?.toString() || ''),
    category: sanitizeHtml(data.category?.toString() || ''),
    description: data.description ? sanitizeHtml(data.description.toString()) : undefined,
    images: Array.isArray(data.images) 
      ? data.images.map((url: string) => sanitizeUrl(url)).filter(Boolean)
      : [],
    colors: Array.isArray(data.colors)
      ? data.colors.map((color: string) => sanitizeHtml(color?.toString() || '')).filter(Boolean)
      : [],
    sizes: Array.isArray(data.sizes)
      ? data.sizes.map((size: string) => sanitizeHtml(size?.toString() || '')).filter(Boolean)
      : [],
    movement: data.movement ? sanitizeHtml(data.movement.toString()) : undefined,
    diameter: data.diameter ? sanitizeHtml(data.diameter.toString()) : undefined,
    material: data.material ? sanitizeHtml(data.material.toString()) : undefined,
    water_resistance: data.water_resistance ? sanitizeHtml(data.water_resistance.toString()) : undefined,
    custom_badge: data.custom_badge ? sanitizeHtml(data.custom_badge.toString()) : undefined,
  };
};

/**
 * Limita tentativas de operações (rate limiting básico)
 */
class RateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private maxAttempts = 5;
  private windowMs = 60000; // 1 minuto

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key);

    if (!userAttempts) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return false;
    }

    // Reset se janela de tempo passou
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return false;
    }

    // Incrementar tentativas
    userAttempts.count++;
    userAttempts.lastAttempt = now;

    return userAttempts.count > this.maxAttempts;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
