
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { secureLog } from './secureLogger';

// Sanitizar HTML com configurações mais restritivas
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    SANITIZE_DOM: true
  });
};

// Sanitizar URL com validação aprimorada
export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    
    // Lista de protocolos permitidos
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      secureLog.warn('Tentativa de uso de protocolo não permitido', { protocol: parsedUrl.protocol });
      return '';
    }
    
    // Verificar se não é localhost em produção
    if (process.env.NODE_ENV === 'production' && 
        (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1')) {
      secureLog.warn('Tentativa de acesso localhost em produção');
      return '';
    }
    
    return parsedUrl.toString();
  } catch (error) {
    secureLog.error('URL inválida fornecida', error, { url: url.substring(0, 50) });
    return '';
  }
};

// Schema de validação para produtos com limites de segurança
export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  brand: z.string().min(1, 'Marca é obrigatória').max(100, 'Marca muito longa'),
  category: z.string().min(1, 'Categoria é obrigatória').max(100, 'Categoria muito longa'),
  clone_category: z.string().max(100, 'Categoria clone muito longa').nullable().optional(),
  price: z.number().min(0, 'Preço deve ser positivo').max(999999, 'Preço muito alto'),
  original_price: z.number().min(0).max(999999, 'Preço original muito alto').nullable().optional(),
  description: z.string().max(5000, 'Descrição muito longa').nullable().optional(),
  images: z.array(z.string().url('URL de imagem inválida')).max(10, 'Muitas imagens').default([]),
  colors: z.array(z.string().max(50, 'Nome da cor muito longo')).max(20, 'Muitas cores').default([]),
  sizes: z.array(z.string().max(50, 'Tamanho muito longo')).max(20, 'Muitos tamanhos').default([]),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_sold_out: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  is_coming_soon: z.boolean().default(false),
  custom_badge: z.string().max(50, 'Badge muito longo').nullable().optional(),
  movement: z.string().max(100, 'Movimento muito longo').nullable().optional(),
  diameter: z.string().max(50, 'Diâmetro muito longo').nullable().optional(),
  material: z.string().max(100, 'Material muito longo').nullable().optional(),
  water_resistance: z.string().max(100, 'Resistência à água muito longa').nullable().optional(),
  specifications: z.record(z.string().max(500, 'Especificação muito longa')).nullable().optional()
});

export const validateProductData = (data: any) => {
  try {
    return productSchema.parse(data);
  } catch (error) {
    secureLog.error('Erro na validação de dados do produto', error);
    throw error;
  }
};

export const sanitizeProductData = (data: any) => {
  const sanitizedData = {
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
  
  secureLog.info('Dados do produto sanitizados com sucesso');
  return sanitizedData;
};

// Rate limiting aprimorado
class SecureRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests = 5;
  private windowMs = 60000; // 1 minuto
  private blocked: Set<string> = new Set();

  isRateLimited(key: string): boolean {
    const now = Date.now();
    
    // Verificar se está bloqueado
    if (this.blocked.has(key)) {
      secureLog.warn('Tentativa de acesso de IP bloqueado', { key: key.substring(0, 10) });
      return true;
    }
    
    const userRequests = this.requests.get(key) || [];
    
    // Remover requests antigas
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      secureLog.warn('Rate limit excedido', { 
        key: key.substring(0, 10), 
        requests: validRequests.length 
      });
      
      // Bloquear temporariamente após muitas tentativas
      if (validRequests.length > this.maxRequests * 2) {
        this.blocked.add(key);
        setTimeout(() => this.blocked.delete(key), this.windowMs * 5);
      }
      
      return true;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return false;
  }

  reset(key: string): void {
    this.requests.delete(key);
    this.blocked.delete(key);
    secureLog.info('Rate limit resetado para chave', { key: key.substring(0, 10) });
  }
}

export const rateLimiter = new SecureRateLimiter();

// Validação de dados de admin
export const adminConfigSchema = z.object({
  whatsapp_number: z.string()
    .regex(/^\+?[\d\s\-\(\)]{10,20}$/, 'Número de WhatsApp inválido')
    .max(20, 'Número muito longo'),
  company_name: z.string()
    .min(1, 'Nome da empresa obrigatório')
    .max(100, 'Nome muito longo'),
  company_phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]{10,20}$/, 'Telefone inválido')
    .max(20, 'Telefone muito longo'),
  company_email: z.string()
    .email('Email inválido')
    .max(100, 'Email muito longo')
});

export const validateAdminConfig = (data: any) => {
  try {
    return adminConfigSchema.parse(data);
  } catch (error) {
    secureLog.error('Erro na validação de configurações de admin', error);
    throw error;
  }
};
