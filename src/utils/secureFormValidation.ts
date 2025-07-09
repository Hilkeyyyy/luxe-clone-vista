
import { sanitizeInput } from './securityEnhancements';
import { validateSensitiveField } from './enhancedPasswordValidation';
import { secureLog } from './secureLogger';

/**
 * Validação de formulários com foco em segurança
 */

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => string | null;
}

interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export class SecureFormValidator {
  private rules: ValidationRules = {};
  private errors: Record<string, string[]> = {};

  constructor(rules: ValidationRules) {
    this.rules = rules;
  }

  validateField(fieldName: string, value: any): string[] {
    const rule = this.rules[fieldName];
    if (!rule) return [];

    const errors: string[] = [];

    // Sanitizar valor se for string
    let sanitizedValue = value;
    if (typeof value === 'string') {
      sanitizedValue = sanitizeInput(value, { maxLength: rule.maxLength || 1000 });
    }

    // Validações básicas
    const fieldErrors = validateSensitiveField(sanitizedValue, fieldName, {
      required: rule.required,
      minLength: rule.minLength,
      maxLength: rule.maxLength,
      pattern: rule.pattern
    });

    errors.push(...fieldErrors);

    // Validador customizado
    if (rule.customValidator && sanitizedValue) {
      const customError = rule.customValidator(sanitizedValue);
      if (customError) {
        errors.push(customError);
      }
    }

    return errors;
  }

  validateForm(formData: Record<string, any>): { isValid: boolean; errors: Record<string, string[]> } {
    this.errors = {};

    for (const [fieldName, value] of Object.entries(formData)) {
      const fieldErrors = this.validateField(fieldName, value);
      if (fieldErrors.length > 0) {
        this.errors[fieldName] = fieldErrors;
      }
    }

    const isValid = Object.keys(this.errors).length === 0;
    
    if (!isValid) {
      secureLog.warn('Validação de formulário falhou', { 
        fieldsWithErrors: Object.keys(this.errors),
        errorCount: Object.keys(this.errors).length
      });
    }

    return { isValid, errors: this.errors };
  }

  getFieldErrors(fieldName: string): string[] {
    return this.errors[fieldName] || [];
  }

  clearErrors(): void {
    this.errors = {};
  }
}

// Validadores específicos para diferentes tipos de campos
export const validators = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Email inválido';
  },

  whatsappNumber: (value: string) => {
    const cleanNumber = value.replace(/\D/g, '');
    return cleanNumber.length >= 10 && cleanNumber.length <= 15 
      ? null 
      : 'Número de WhatsApp inválido';
  },

  url: (value: string) => {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) 
        ? null 
        : 'URL deve usar HTTP ou HTTPS';
    } catch {
      return 'URL inválida';
    }
  },

  positiveNumber: (value: number) => {
    return typeof value === 'number' && value > 0 
      ? null 
      : 'Valor deve ser um número positivo';
  },

  productName: (value: string) => {
    if (value.length < 3) return 'Nome muito curto';
    if (value.length > 200) return 'Nome muito longo';
    if (!/^[a-zA-Z0-9\s\-_.,!()]+$/.test(value)) {
      return 'Nome contém caracteres inválidos';
    }
    return null;
  }
};

// Regras predefinidas para formulários comuns
export const formValidationRules = {
  adminSettings: {
    whatsapp_number: {
      required: true,
      minLength: 10,
      maxLength: 20,
      customValidator: validators.whatsappNumber
    },
    company_name: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    company_email: {
      required: true,
      maxLength: 320,
      customValidator: validators.email
    },
    company_phone: {
      required: true,
      minLength: 10,
      maxLength: 20,
      customValidator: validators.whatsappNumber
    },
    instagram_url: {
      required: false,
      maxLength: 500,
      customValidator: validators.url
    }
  },

  product: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 200,
      customValidator: validators.productName
    },
    brand: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    price: {
      required: true,
      customValidator: validators.positiveNumber
    },
    category: {
      required: true,
      minLength: 2,
      maxLength: 100
    }
  }
};
