
import { secureLog } from './secureLogger';

/**
 * Validação de senha fortalecida para maior segurança
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  // Requisitos mínimos de segurança
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

  // Verificações adicionais de segurança
  if (password.length > 128) {
    errors.push('Senha muito longa (máximo 128 caracteres)');
  }

  // Verificar padrões comuns inseguros
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Senha contém padrões muito comuns');
  }

  // Verificar repetição excessiva
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Senha não pode ter mais de 3 caracteres repetidos consecutivos');
  }

  // Calcular força da senha
  let strengthScore = 0;
  if (password.length >= 8) strengthScore++;
  if (password.length >= 12) strengthScore++;
  if (/[A-Z]/.test(password)) strengthScore++;
  if (/[a-z]/.test(password)) strengthScore++;
  if (/[0-9]/.test(password)) strengthScore++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strengthScore++;
  if (password.length >= 16) strengthScore++;

  if (strengthScore >= 6) {
    strength = 'strong';
  } else if (strengthScore >= 4) {
    strength = 'medium';
  }

  const isValid = errors.length === 0 && strengthScore >= 4;

  if (!isValid) {
    secureLog.warn('Tentativa de senha fraca detectada');
  }

  return {
    isValid,
    errors,
    strength
  };
};

// Validação adicional para campos sensíveis
export const validateSensitiveField = (
  value: string,
  fieldName: string,
  options: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    required?: boolean;
  } = {}
): string[] => {
  const errors: string[] = [];
  const {
    minLength = 1,
    maxLength = 500,
    pattern,
    required = true
  } = options;

  if (required && (!value || value.trim().length === 0)) {
    errors.push(`${fieldName} é obrigatório`);
    return errors;
  }

  if (value && value.length < minLength) {
    errors.push(`${fieldName} deve ter pelo menos ${minLength} caracteres`);
  }

  if (value && value.length > maxLength) {
    errors.push(`${fieldName} deve ter no máximo ${maxLength} caracteres`);
  }

  if (value && pattern && !pattern.test(value)) {
    errors.push(`${fieldName} tem formato inválido`);
  }

  // Verificar tentativas de XSS
  if (value && /<script|javascript:|on\w+=/i.test(value)) {
    errors.push(`${fieldName} contém código potencialmente perigoso`);
    secureLog.warn(`Tentativa de XSS detectada em ${fieldName}`, { 
      field: fieldName, 
      valueLength: value.length 
    });
  }

  return errors;
};
