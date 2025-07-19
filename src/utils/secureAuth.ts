
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogger';

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
export const cleanAuthState = () => {
  try {
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
            key.includes('sb-cfzlalckxzmfdxrpnirg')
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

  isRateLimited(key: string): boolean {
    const now = Date.now();
    
    // Verificar se está bloqueado
    if (this.blocked.has(key)) {
      const record = this.attempts.get(key);
      if (record && now - record.lastAttempt < this.blockDurationMs) {
        secureLog.warn('Acesso bloqueado por rate limiting', { 
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
    
    if (record.count > this.maxAttempts) {
      this.blocked.add(key);
      secureLog.warn('Rate limit excedido - bloqueando acesso', {
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
    
    // Verificar se a sessão é muito antiga
    // Corrigido: usar created_at ao invés de issued_at
    const sessionAge = Date.now() - new Date(session.created_at || 0).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    
    if (sessionAge > maxAge) {
      secureLog.warn('Sessão muito antiga detectada', {
        sessionAge: Math.ceil(sessionAge / 1000 / 60 / 60),
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
