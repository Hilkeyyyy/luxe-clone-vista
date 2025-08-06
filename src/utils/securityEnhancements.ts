
import DOMPurify from 'dompurify';
import { secureLog } from './secureLogger';

// Enhanced input sanitization (preservando espaços)
export const sanitizeInput = (input: string, options?: { 
  allowBasicHtml?: boolean;
  maxLength?: number;
  preserveSpaces?: boolean;
}): string => {
  if (!input || typeof input !== 'string') return '';
  
  const maxLength = options?.maxLength || 1000;
  let sanitized = input.substring(0, maxLength);
  
  if (options?.allowBasicHtml) {
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false
    });
  } else {
    // Remove all HTML for non-HTML fields
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  // Additional XSS prevention
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+=/gi, '');
  
  // SEMPRE preservar espaços internos - apenas fazer trim normal
  return sanitized.trim();
};

// CSRF token management
class CSRFManager {
  private token: string | null = null;
  
  generateToken(): string {
    this.token = crypto.randomUUID();
    sessionStorage.setItem('csrf-token', this.token);
    return this.token;
  }
  
  validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf-token');
    return storedToken === token && token !== null;
  }
  
  getToken(): string | null {
    return sessionStorage.getItem('csrf-token');
  }
  
  clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('csrf-token');
  }
}

export const csrfManager = new CSRFManager();

// Session security utilities
export const secureSessionStorage = {
  setItem: (key: string, value: any) => {
    try {
      const encryptedValue = btoa(JSON.stringify({
        value,
        timestamp: Date.now(),
        csrf: csrfManager.getToken()
      }));
      sessionStorage.setItem(key, encryptedValue);
    } catch (error) {
      secureLog.error('Erro ao armazenar dados da sessão', error);
    }
  },
  
  getItem: (key: string) => {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      
      const decrypted = JSON.parse(atob(item));
      
      // Check if data is too old (1 hour)
      if (Date.now() - decrypted.timestamp > 3600000) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return decrypted.value;
    } catch (error) {
      secureLog.error('Erro ao recuperar dados da sessão', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    sessionStorage.removeItem(key);
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  if (password.length > 128) {
    errors.push('Senha muito longa (máximo 128 caracteres)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Secure data encryption for sensitive fields
export const encryptSensitiveData = (data: string): string => {
  try {
    // Simple base64 encoding for now - in production, use proper encryption
    return btoa(data);
  } catch (error) {
    secureLog.error('Erro na criptografia', error);
    return data;
  }
};

export const decryptSensitiveData = (encryptedData: string): string => {
  try {
    return atob(encryptedData);
  } catch (error) {
    secureLog.error('Erro na descriptografia', error);
    return encryptedData;
  }
};
