
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
    // Validar usando a função do banco de dados
    const { data, error } = await supabase.rpc('validate_password_strength', {
      password: password
    });

    if (error) {
      secureLog.error('Erro ao validar força da senha no banco', error);
      // Fallback para validação local
      return validatePasswordLocal(password);
    }

    if (!data) {
      errors.push('Senha não atende aos critérios de segurança');
    }

    // Determinar força da senha
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const criteriaMet = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (password.length >= 12 && criteriaMet >= 3) {
      strength = 'strong';
    } else if (password.length >= 8 && criteriaMet >= 2) {
      strength = 'medium';
    }

    return {
      isValid: data && errors.length === 0,
      errors,
      strength
    };
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

// Função para registrar eventos de segurança
export const logSecurityEvent = async (
  action: string,
  details: Record<string, any> = {},
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.rpc('log_security_event', {
      p_user_id: user?.id || null,
      p_action: action,
      p_details: details,
      p_ip_address: ipAddress || null,
      p_user_agent: userAgent || null
    });

    if (error) {
      secureLog.error('Erro ao registrar evento de segurança', error);
    } else {
      secureLog.info('Evento de segurança registrado', { action, userId: user?.id?.substring(0, 8) });
    }
  } catch (error) {
    secureLog.error('Erro crítico ao registrar evento de segurança', error);
  }
};

// Função para limpar tokens expirados
export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    const { error } = await supabase.rpc('cleanup_expired_tokens');
    
    if (error) {
      secureLog.error('Erro ao limpar tokens expirados', error);
    } else {
      secureLog.info('Tokens expirados limpos com sucesso');
    }
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
