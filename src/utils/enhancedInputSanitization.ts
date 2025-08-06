
import DOMPurify from 'dompurify';
import { secureLog } from './secureLogger';

// Configurações de sanitização mais restritivas
const sanitizeConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: false,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  SANITIZE_DOM: true,
  FORBID_CONTENTS: ['script', 'style', 'object', 'embed', 'iframe'],
  FORBID_TAGS: ['script', 'style', 'object', 'embed', 'iframe', 'form', 'input', 'button']
};

// Padrões perigosos para detectar
const dangerousPatterns = [
  /javascript:/gi,
  /<script/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /expression\s*\(/gi,
  /@import/gi,
  /url\s*\(/gi
];

// Sanitizar string básica (preservando espaços necessários)
export const sanitizeString = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Truncar se muito longo
  let sanitized = input.slice(0, maxLength);
  
  // Remover apenas caracteres de controle perigosos (preservando espaços)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Detectar padrões perigosos
  const hasDangerousPattern = dangerousPatterns.some(pattern => pattern.test(sanitized));
  if (hasDangerousPattern) {
    secureLog.warn('Padrão perigoso detectado na entrada', { 
      input: input.substring(0, 50) 
    });
    // Em caso de padrão perigoso, remover tags maliciosas mas preservar texto
    sanitized = sanitized.replace(/[<>'"]/g, '');
  }
  
  // Trim apenas espaços no início e fim, preservando espaços internos
  return sanitized.replace(/^\s+|\s+$/g, '');
};

// Sanitizar HTML com configurações restritivas
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  try {
    const cleaned = DOMPurify.sanitize(html, sanitizeConfig);
    
    // Log se houve modificações significativas
    if (cleaned.length < html.length * 0.8) {
      secureLog.info('HTML foi significativamente sanitizado', {
        originalLength: html.length,
        cleanedLength: cleaned.length
      });
    }
    
    return cleaned;
  } catch (error) {
    secureLog.error('Erro na sanitização de HTML', error);
    return '';
  }
};

// Validar e sanitizar email
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  
  const sanitized = email.toLowerCase().trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(sanitized)) {
    secureLog.warn('Email inválido fornecido', { email: email.substring(0, 10) });
    return '';
  }
  
  return sanitized;
};

// Sanitizar dados de produto
export const sanitizeProductData = (data: any) => {
  if (!data || typeof data !== 'object') return {};
  
  return {
    name: sanitizeString(data.name, 200),
    brand: sanitizeString(data.brand, 100),
    category: sanitizeString(data.category, 100),
    description: data.description ? sanitizeHtml(data.description) : null,
    price: typeof data.price === 'number' && data.price >= 0 ? data.price : 0,
    original_price: typeof data.original_price === 'number' && data.original_price >= 0 ? data.original_price : null,
    custom_badge: data.custom_badge ? sanitizeString(data.custom_badge, 50) : null,
    movement: data.movement ? sanitizeString(data.movement, 100) : null,
    diameter: data.diameter ? sanitizeString(data.diameter, 50) : null,
    material: data.material ? sanitizeString(data.material, 100) : null,
    water_resistance: data.water_resistance ? sanitizeString(data.water_resistance, 100) : null,
    // Arrays devem ser validados separadamente
    images: Array.isArray(data.images) ? data.images.filter(img => typeof img === 'string' && img.length > 0) : [],
    colors: Array.isArray(data.colors) ? data.colors.map(color => sanitizeString(color, 50)).filter(Boolean) : [],
    sizes: Array.isArray(data.sizes) ? data.sizes.map(size => sanitizeString(size, 50)).filter(Boolean) : []
  };
};

// Detectar tentativas de injeção
export const detectInjectionAttempt = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  
  const injectionPatterns = [
    /union\s+select/gi,
    /drop\s+table/gi,
    /insert\s+into/gi,
    /delete\s+from/gi,
    /update\s+set/gi,
    /<script/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];
  
  return injectionPatterns.some(pattern => pattern.test(input));
};
