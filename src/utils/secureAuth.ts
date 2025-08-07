
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogger';
import { validatePasswordStrength, logSecurityEvent } from './enhancedSecurityValidation';

/**
 * Utilities de autenticação segura aprimorados
 */

// Validar se usuário é admin através do banco de dados com cache
let adminStatusCache = new Map<string, { isAdmin: boolean, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const verifyAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    // Verificar cache primeiro
    const cached = adminStatusCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.isAdmin;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      secureLog.warn('Falha ao verificar status de admin', { 
        userId: userId.substring(0, 8),
        error: error?.message 
      });
      return false;
    }

    const isAdmin = data.role === 'admin';
    
    // Atualizar cache
    adminStatusCache.set(userId, {
      isAdmin,
      timestamp: Date.now()
    });

    // Registrar evento de verificação de admin
    if (isAdmin) {
      await logSecurityEvent('admin_verification', { userId: userId.substring(0, 8) });
    }

    return isAdmin;
  } catch (error) {
    secureLog.error('Erro crítico ao verificar status de admin', error);
    return false;
  }
};

// Limpar cache de admin
export const clearAdminStatusCache = (userId?: string) => {
  if (userId) {
    adminStatusCache.delete(userId);
  } else {
    adminStatusCache.clear();
  }
};

// Limpar estado de autenticação com mais segurança
export const cleanAuthState = async () => {
  try {
    // Registrar evento de limpeza
    await logSecurityEvent('auth_state_cleanup', { timestamp: new Date().toISOString() });
    
    // Limpar cache de admin
    clearAdminStatusCache();
    
    // Lista mais abrangente de chaves para remover
    const authKeys = [
      'supabase.auth.token',
      'sb-cfzlalckxzmfdxrpnirg-auth-token',
      'supabase.auth.session',
      'sb-cfzlalckxzmfdxrpnirg-auth-session'
    ];
    
    // Remover chaves específicas do localStorage
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Ignorar erros de acesso ao localStorage
      }
    });
    
    // Remover todas as chaves que começam com padrões específicos
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('supabase.auth.') || 
          key.includes('sb-cfzlalckxzmfdxrpnirg') ||
          key.includes('auth-token') ||
          key.includes('auth-session')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      // Continuar mesmo se houver erro
    }
    
    // Limpar sessionStorage se disponível
    if (typeof sessionStorage !== 'undefined') {
      try {
        const sessionKeys: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (
            key.startsWith('supabase.auth.') || 
            key.includes('sb-cfzlalckxzmfdxrpnirg') ||
            key.startsWith('security_')
          )) {
            sessionKeys.push(key);
          }
        }
        sessionKeys.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        // Ignorar erros de sessionStorage
      }
    }
    
    secureLog.info('Estado de autenticação limpo com sucesso');
  } catch (error) {
    secureLog.error('Erro ao limpar estado de autenticação', error);
  }
};

// Rate limiting aprimorado para tentativas de login
class EnhancedRateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private blocked = new Set<string>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutos
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutos

  async isRateLimited(key: string): Promise<boolean> {
    // Para operações de configuração de sistema e admin, não aplicar rate limiting
    if (key.includes('UPDATE_ADMIN_SETTINGS') || 
        key.includes('HERO_') || 
        key.includes('admin_') ||
        key.includes('settings_')) {
      return false;
    }

    const now = Date.now();
    
    // Verificar se está bloqueado
    if (this.blocked.has(key)) {
      const record = this.attempts.get(key);
      if (record && now - record.lastAttempt < this.blockDurationMs) {
        await logSecurityEvent('rate_limit_blocked', { 
          key: key.substring(0, 10),
          timeRemaining: Math.ceil((this.blockDurationMs - (now - record.lastAttempt)) / 1000 / 60)
        });
        return true;
      } else {
        // Período de bloqueio expirou
        this.blocked.delete(key);
        this.attempts.delete(key);
      }
    }
    
    const record = this.attempts.get(key) || { count: 0, lastAttempt: 0 };
    
    // Resetar se passou da janela de tempo
    if (now - record.lastAttempt > this.windowMs) {
      record.count = 0;
    }
    
    record.count++;
    record.lastAttempt = now;
    this.attempts.set(key, record);
    
    // Aumentar limite para operações críticas de admin
    const currentMaxAttempts = key.includes('admin') ? this.maxAttempts * 3 : this.maxAttempts;
    
    if (record.count > currentMaxAttempts) {
      this.blocked.add(key);
      await logSecurityEvent('rate_limit_exceeded', {
        key: key.substring(0, 10),
        attempts: record.count,
        blockDuration: this.blockDurationMs / 1000 / 60
      });
      return true;
    }
    
    return false;
  }

  reset(key: string): void {
    this.attempts.delete(key);
    this.blocked.delete(key);
    secureLog.info('Rate limit resetado', { key: key.substring(0, 10) });
  }

  getAttemptCount(key: string): number {
    return this.attempts.get(key)?.count || 0;
  }
}

export const rateLimiter = new EnhancedRateLimiter();

// Função para detectar sessões suspeitas
export const detectSuspiciousSession = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    // Verificar se a sessão é muito antiga usando expires_at
    const expiresAt = new Date(session.expires_at || 0).getTime();
    const now = Date.now();
    const timeToExpiry = expiresAt - now;
    
    // Se a sessão expira em menos de 1 hora, considerar suspeita
    const oneHour = 60 * 60 * 1000;
    if (timeToExpiry < oneHour && timeToExpiry > 0) {
      await logSecurityEvent('suspicious_session_detected', {
        timeToExpiry: Math.ceil(timeToExpiry / 1000 / 60),
        userId: session.user.id.substring(0, 8)
      });
      return true;
    }
    
    return false;
  } catch (error) {
    secureLog.error('Erro ao detectar sessão suspeita', error);
    return false;
  }
};

// Validar integridade da sessão
export const validateSessionIntegrity = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    // Verificar se os dados da sessão são válidos
    if (!session.user || !session.user.id || !session.user.email) {
      await logSecurityEvent('invalid_session_data', { 
        hasUser: !!session.user,
        hasId: !!session.user?.id,
        hasEmail: !!session.user?.email
      });
      return false;
    }
    
    // Verificar se a sessão não está expirada
    const expiresAt = new Date(session.expires_at || 0);
    if (expiresAt.getTime() <= Date.now()) {
      await logSecurityEvent('expired_session_detected', {
        expiresAt: expiresAt.toISOString(),
        userId: session.user.id.substring(0, 8)
      });
      return false;
    }
    
    return true;
  } catch (error) {
    secureLog.error('Erro ao validar integridade da sessão', error);
    return false;
  }
};

// Função para limpeza automática de segurança
export const performSecurityCleanup = async (): Promise<void> => {
  try {
    // Verificar e limpar sessões suspeitas
    const isSuspicious = await detectSuspiciousSession();
    if (isSuspicious) {
      secureLog.warn('Sessão suspeita detectada - limpando estado');
      await cleanAuthState();
      await supabase.auth.signOut();
    }
    
    // Validar integridade da sessão
    const isValid = await validateSessionIntegrity();
    if (!isValid) {
      secureLog.warn('Sessão inválida detectada - limpando estado');
      await cleanAuthState();
    }
    
    // Limpar cache de admin expirado
    const now = Date.now();
    for (const [userId, cache] of adminStatusCache.entries()) {
      if (now - cache.timestamp > CACHE_DURATION) {
        adminStatusCache.delete(userId);
      }
    }
    
  } catch (error) {
    secureLog.error('Erro durante limpeza de segurança', error);
  }
};

// Função para login seguro com validação de senha
export const secureLogin = async (email: string, password: string): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> => {
  try {
    // Verificar rate limiting
    const rateLimited = await rateLimiter.isRateLimited(email);
    if (rateLimited) {
      return {
        success: false,
        error: 'Muitas tentativas de login. Tente novamente mais tarde.'
      };
    }

    // Validar força da senha
    const passwordValidation = await validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      await logSecurityEvent('weak_password_login_attempt', {
        email: email.substring(0, 3) + '***',
        errors: passwordValidation.errors
      });
    }

    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      await logSecurityEvent('login_failed', {
        email: email.substring(0, 3) + '***',
        error: error.message
      });
      return {
        success: false,
        error: error.message
      };
    }

    // Login bem-sucedido
    await logSecurityEvent('login_successful', {
      email: email.substring(0, 3) + '***',
      userId: data.user?.id?.substring(0, 8)
    });

    // Resetar rate limiter
    rateLimiter.reset(email);

    return {
      success: true,
      data
    };
  } catch (error) {
    secureLog.error('Erro crítico durante login seguro', error);
    return {
      success: false,
      error: 'Erro interno do servidor'
    };
  }
};

// Executar limpeza automática a cada 10 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    performSecurityCleanup();
  }, 10 * 60 * 1000);
}
