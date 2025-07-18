
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogger';

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
}

class EnhancedRateLimiter {
  private attempts = new Map<string, RateLimitEntry>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutos
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutos de bloqueio

  // Log tentativas de login no banco de dados
  async logLoginAttempt(email: string, success: boolean, ipAddress?: string) {
    try {
      const { error } = await supabase
        .from('login_attempts')
        .insert({
          email: email.toLowerCase().trim(),
          ip_address: ipAddress,
          success,
        });

      if (error) {
        secureLog.error('Erro ao registrar tentativa de login', error);
      }
    } catch (error) {
      secureLog.error('Erro crítico ao registrar tentativa de login', error);
    }
  }

  // Verificar se está no limite de tentativas
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      });
      return false;
    }

    // Se está bloqueado, verificar se ainda está no período de bloqueio
    if (entry.blocked) {
      if (now - entry.lastAttempt < this.blockDurationMs) {
        secureLog.warn('Acesso bloqueado por rate limiting', { 
          identifier: identifier.substring(0, 10) 
        });
        return true;
      } else {
        // Período de bloqueio expirou, resetar
        this.reset(identifier);
        return false;
      }
    }

    // Verificar janela de tempo
    if (now - entry.firstAttempt > this.windowMs) {
      // Janela expirou, resetar contador
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      });
      return false;
    }

    // Incrementar contador
    entry.count++;
    entry.lastAttempt = now;

    // Verificar se excedeu o limite
    if (entry.count > this.maxAttempts) {
      entry.blocked = true;
      secureLog.warn('Rate limit excedido - bloqueando acesso', {
        identifier: identifier.substring(0, 10),
        attempts: entry.count
      });
      return true;
    }

    return false;
  }

  // Resetar contador para um identificador
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  // Obter IP do cliente (melhor esforço)
  getClientIP(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    // Em produção, isso seria obtido do servidor
    // Por enquanto, usamos um identificador baseado no navegador
    return 'client-browser';
  }

  // Verificar tentativas recentes no banco
  async checkRecentAttempts(email: string): Promise<boolean> {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - this.windowMs);
      
      const { data, error } = await supabase
        .from('login_attempts')
        .select('success')
        .eq('email', email.toLowerCase().trim())
        .gte('attempt_time', fifteenMinutesAgo.toISOString())
        .eq('success', false);

      if (error) {
        secureLog.error('Erro ao verificar tentativas recentes', error);
        return false;
      }

      const failedAttempts = data?.length || 0;
      return failedAttempts >= this.maxAttempts;
    } catch (error) {
      secureLog.error('Erro crítico ao verificar tentativas recentes', error);
      return false;
    }
  }
}

export const enhancedRateLimiter = new EnhancedRateLimiter();
