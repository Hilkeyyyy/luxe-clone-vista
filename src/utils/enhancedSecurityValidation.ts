
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogger';

/**
 * Validação de segurança aprimorada para senhas e autenticação
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePasswordStrength = async (password: string): Promise<PasswordValidationResult> => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  try {
    // Validação local (já que a função do banco não existe nos tipos)
    return validatePasswordLocal(password);
  } catch (error) {
    secureLog.error('Erro crítico na validação de senha', error);
    return validatePasswordLocal(password);
  }
};

const validatePasswordLocal = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (password.length >= 12 && hasSpecialChars && errors.length === 0) {
    strength = 'strong';
  } else if (password.length >= 8 && errors.length === 0) {
    strength = 'medium';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

// Função para registrar eventos de segurança (simulada localmente)
export const logSecurityEvent = async (
  action: string,
  details: Record<string, any> = {},
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Log local até que a tabela seja criada
    secureLog.info('Evento de segurança registrado', { 
      action, 
      userId: user?.id?.substring(0, 8),
      details,
      ipAddress,
      userAgent
    });
  } catch (error) {
    secureLog.error('Erro crítico ao registrar evento de segurança', error);
  }
};

// Função para limpeza de tokens expirados (simulada localmente)
export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    // Limpeza local até que a função seja implementada
    secureLog.info('Limpeza de tokens expirados simulada');
  } catch (error) {
    secureLog.error('Erro crítico ao limpar tokens expirados', error);
  }
};

// Validação de entrada para prevenir ataques de injeção
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remover caracteres perigosos
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Verificação de integridade de dados
export const validateDataIntegrity = (data: any): boolean => {
  try {
    // Verificar se não é null ou undefined
    if (data === null || data === undefined) {
      return false;
    }
    
    // Verificar se é um objeto válido
    if (typeof data === 'object' && data !== null) {
      // Verificar se não há propriedades perigosas
      const dangerousProps = ['__proto__', 'constructor', 'prototype'];
      for (const prop of dangerousProps) {
        if (prop in data) {
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    secureLog.error('Erro na validação de integridade de dados', error);
    return false;
  }
};

// Validação de dados de produto
export const validateProductData = (productData: any): boolean => {
  try {
    if (!productData || typeof productData !== 'object') {
      return false;
    }
    
    // Verificar campos obrigatórios
    const requiredFields = ['name', 'brand', 'price'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return false;
      }
    }
    
    // Verificar se price é um número válido
    if (typeof productData.price !== 'number' || productData.price < 0) {
      return false;
    }
    
    return validateDataIntegrity(productData);
  } catch (error) {
    secureLog.error('Erro na validação de dados do produto', error);
    return false;
  }
};

// Validação de configurações de admin
export const validateAdminSettings = (settings: any): boolean => {
  try {
    if (!settings || typeof settings !== 'object') {
      return false;
    }
    
    // Verificar se não há propriedades perigosas
    const dangerousProps = ['__proto__', 'constructor', 'prototype'];
    for (const prop of dangerousProps) {
      if (prop in settings) {
        return false;
      }
    }
    
    return validateDataIntegrity(settings);
  } catch (error) {
    secureLog.error('Erro na validação de configurações de admin', error);
    return false;
  }
};

// Rate limiting aprimorado
export class SecurityRateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number; blocked: boolean }>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutos
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutos

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record) {
      this.attempts.set(key, { count: 1, lastAttempt: now, blocked: false });
      return false;
    }
    
    // Verificar se está bloqueado
    if (record.blocked) {
      if (now - record.lastAttempt < this.blockDurationMs) {
        return true;
      } else {
        // Período de bloqueio expirou
        record.blocked = false;
        record.count = 1;
        record.lastAttempt = now;
        return false;
      }
    }
    
    // Resetar se passou da janela de tempo
    if (now - record.lastAttempt > this.windowMs) {
      record.count = 1;
      record.lastAttempt = now;
      return false;
    }
    
    record.count++;
    record.lastAttempt = now;
    
    if (record.count > this.maxAttempts) {
      record.blocked = true;
      logSecurityEvent('rate_limit_exceeded', { key: key.substring(0, 10) });
      return true;
    }
    
    return false;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const securityRateLimiter = new SecurityRateLimiter();
