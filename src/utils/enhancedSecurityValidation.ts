
import { secureLog } from './secureLogger';

/**
 * Validações de segurança aprimoradas para dados de entrada
 */

export const validateProductData = (productData: any): string[] => {
  const errors: string[] = [];
  
  // Validar campos obrigatórios
  if (!productData.name || typeof productData.name !== 'string' || productData.name.trim().length === 0) {
    errors.push('Nome do produto é obrigatório');
  }
  
  if (!productData.brand || typeof productData.brand !== 'string' || productData.brand.trim().length === 0) {
    errors.push('Marca do produto é obrigatória');
  }
  
  if (!productData.price || typeof productData.price !== 'number' || productData.price <= 0) {
    errors.push('Preço deve ser um número positivo');
  }
  
  if (productData.original_price && (typeof productData.original_price !== 'number' || productData.original_price <= 0)) {
    errors.push('Preço original deve ser um número positivo');
  }
  
  // Validar limites de tamanho
  if (productData.name && productData.name.length > 200) {
    errors.push('Nome do produto muito longo (máximo 200 caracteres)');
  }
  
  if (productData.brand && productData.brand.length > 100) {
    errors.push('Nome da marca muito longo (máximo 100 caracteres)');
  }
  
  if (productData.description && productData.description.length > 5000) {
    errors.push('Descrição muito longa (máximo 5000 caracteres)');
  }
  
  // Validar arrays
  if (productData.images && !Array.isArray(productData.images)) {
    errors.push('Imagens deve ser um array');
  }
  
  if (productData.colors && !Array.isArray(productData.colors)) {
    errors.push('Cores deve ser um array');
  }
  
  if (productData.sizes && !Array.isArray(productData.sizes)) {
    errors.push('Tamanhos deve ser um array');
  }
  
  return errors;
};

export const validateAdminSettings = (settings: Record<string, any>): string[] => {
  const errors: string[] = [];
  
  // Lista de configurações permitidas
  const allowedSettings = [
    'whatsapp_number',
    'whatsapp_message_template',
    'whatsapp_enabled',
    'company_name',
    'company_phone',
    'company_email',
    'instagram_url'
  ];
  
  for (const [key, value] of Object.entries(settings)) {
    // Validar se a chave é permitida
    if (!allowedSettings.includes(key)) {
      errors.push(`Configuração não permitida: ${key}`);
      continue;
    }
    
    // Validar tamanho da chave
    if (key.length > 100) {
      errors.push(`Nome da configuração muito longo: ${key}`);
    }
    
    // Validar valor baseado no tipo
    if (typeof value === 'string' && value.length > 1000) {
      errors.push(`Valor muito longo para: ${key}`);
    }
    
    // Validações específicas por campo
    switch (key) {
      case 'whatsapp_number':
        if (typeof value === 'string' && value && !/^\d{10,15}$/.test(value.replace(/\D/g, ''))) {
          errors.push('Número do WhatsApp inválido');
        }
        break;
        
      case 'company_email':
        if (typeof value === 'string' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push('Email da empresa inválido');
        }
        break;
        
      case 'instagram_url':
        if (typeof value === 'string' && value && !value.startsWith('https://')) {
          errors.push('URL do Instagram deve começar com https://');
        }
        break;
    }
  }
  
  return errors;
};

export const validateUserInput = (input: any, fieldName: string, options: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: 'string' | 'number' | 'email' | 'url';
}): string[] => {
  const errors: string[] = [];
  
  // Verificar se é obrigatório
  if (options.required && (!input || (typeof input === 'string' && input.trim().length === 0))) {
    errors.push(`${fieldName} é obrigatório`);
    return errors;
  }
  
  // Se não é obrigatório e está vazio, não validar mais
  if (!input) return errors;
  
  // Validar tipo
  if (options.type === 'string' && typeof input !== 'string') {
    errors.push(`${fieldName} deve ser texto`);
    return errors;
  }
  
  if (options.type === 'number' && typeof input !== 'number') {
    errors.push(`${fieldName} deve ser um número`);
    return errors;
  }
  
  // Validar comprimento para strings
  if (typeof input === 'string') {
    if (options.minLength && input.length < options.minLength) {
      errors.push(`${fieldName} deve ter pelo menos ${options.minLength} caracteres`);
    }
    
    if (options.maxLength && input.length > options.maxLength) {
      errors.push(`${fieldName} deve ter no máximo ${options.maxLength} caracteres`);
    }
    
    // Validações específicas por tipo
    if (options.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
      errors.push(`${fieldName} deve ser um email válido`);
    }
    
    if (options.type === 'url' && !input.startsWith('http')) {
      errors.push(`${fieldName} deve ser uma URL válida`);
    }
  }
  
  return errors;
};

/**
 * Valida se o usuário tem permissão para realizar uma ação
 */
export const validateUserPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'admin': 3,
    'moderator': 2,
    'user': 1
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 999;
  
  const hasPermission = userLevel >= requiredLevel;
  
  if (!hasPermission) {
    secureLog.warn('Tentativa de acesso sem permissão', { 
      userRole, 
      requiredRole, 
      userLevel, 
      requiredLevel 
    });
  }
  
  return hasPermission;
};
