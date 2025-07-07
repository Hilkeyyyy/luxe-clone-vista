
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogger';

/**
 * Utilities de autenticação segura
 */

// Validar se usuário é admin através do banco de dados
export const verifyAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      secureLog.warn('Failed to verify admin status', { userId: userId.substring(0, 8) });
      return false;
    }

    return data.role === 'admin';
  } catch (error) {
    secureLog.error('Error verifying admin status', error);
    return false;
  }
};

// Limpar estado de autenticação
export const cleanAuthState = () => {
  try {
    // Remover tokens de localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('supabase.auth.') || key.includes('sb-'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Remover tokens de sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const sessionKeys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('supabase.auth.') || key.includes('sb-'))) {
          sessionKeys.push(key);
        }
      }
      sessionKeys.forEach(key => sessionStorage.removeItem(key));
    }
    
    secureLog.info('Auth state cleaned successfully');
  } catch (error) {
    secureLog.error('Error cleaning auth state', error);
  }
};

// Rate limiting para tentativas de login
class RateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number }>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutos

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return false;
    }

    // Reset se passou da janela de tempo
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return false;
    }

    // Incrementar tentativas
    record.count++;
    record.lastAttempt = now;

    return record.count > this.maxAttempts;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
