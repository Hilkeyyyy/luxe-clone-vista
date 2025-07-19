
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

  // Log tentativas de login (simplificado sem banco de dados)
  async logLoginAttempt(email: string, success: boolean, ipAddress?: string) {
    try {
      // Log apenas no console e armazenamento local
      secureLog.info('Tentativa de login registrada', {
        email: email.substring(0, 10),
        success,
        ipAddress: ipAddress?.substring(0, 10)
      });
      
      // Salvar no localStorage para persistência básica
      this.saveAttemptToStorage(email, success, ipAddress);
    } catch (error) {
      secureLog.error('Erro ao registrar tentativa de login', error);
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
          identifier: identifier.substring(0, 10),
          timeRemaining: Math.ceil((this.blockDurationMs - (now - entry.lastAttempt)) / 1000 / 60)
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
        attempts: entry.count,
        blockDuration: this.blockDurationMs / 1000 / 60
      });
      return true;
    }

    return false;
  }

  // Resetar contador para um identificador
  reset(identifier: string): void {
    this.attempts.delete(identifier);
    secureLog.info('Rate limit resetado', { identifier: identifier.substring(0, 10) });
  }

  // Obter IP do cliente (melhor esforço)
  getClientIP(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    // Em produção, isso seria obtido do servidor
    // Por enquanto, usamos um identificador baseado no navegador
    return 'client-browser';
  }

  // Verificar tentativas recentes usando localStorage
  async checkRecentAttempts(email: string): Promise<boolean> {
    try {
      const storageKey = `failed_attempts_${email}`;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return false;
      
      const data = JSON.parse(stored);
      const fifteenMinutesAgo = Date.now() - this.windowMs;
      
      // Filtrar tentativas recentes que falharam
      const recentFailures = data.attempts?.filter((attempt: any) => 
        attempt.timestamp > fifteenMinutesAgo && !attempt.success
      ) || [];
      
      return recentFailures.length >= this.maxAttempts;
    } catch (error) {
      secureLog.error('Erro ao verificar tentativas recentes', error);
      return false;
    }
  }

  // Salvar tentativa no localStorage
  private saveAttemptToStorage(email: string, success: boolean, ipAddress?: string) {
    try {
      const storageKey = `failed_attempts_${email}`;
      const stored = localStorage.getItem(storageKey) || '{"attempts": []}';
      const data = JSON.parse(stored);
      
      data.attempts = data.attempts || [];
      data.attempts.push({
        timestamp: Date.now(),
        success,
        ipAddress: ipAddress?.substring(0, 10)
      });
      
      // Manter apenas últimas 24 horas
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      data.attempts = data.attempts.filter((attempt: any) => 
        attempt.timestamp > oneDayAgo
      );
      
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      secureLog.error('Erro ao armazenar tentativa', error);
    }
  }

  // Obter estatísticas de tentativas
  getAttemptStats(identifier: string): { count: number; blocked: boolean; timeUntilReset?: number } {
    const entry = this.attempts.get(identifier);
    if (!entry) return { count: 0, blocked: false };
    
    const now = Date.now();
    let timeUntilReset;
    
    if (entry.blocked) {
      timeUntilReset = Math.max(0, this.blockDurationMs - (now - entry.lastAttempt));
    } else {
      timeUntilReset = Math.max(0, this.windowMs - (now - entry.firstAttempt));
    }
    
    return {
      count: entry.count,
      blocked: entry.blocked,
      timeUntilReset: timeUntilReset > 0 ? timeUntilReset : undefined
    };
  }

  // Limpar tentativas antigas
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, entry] of this.attempts.entries()) {
      // Remover entradas antigas que não estão mais bloqueadas
      if (!entry.blocked && now - entry.lastAttempt > this.windowMs) {
        this.attempts.delete(identifier);
      }
      // Remover bloqueios expirados
      else if (entry.blocked && now - entry.lastAttempt > this.blockDurationMs) {
        this.attempts.delete(identifier);
      }
    }
  }
}

export const enhancedRateLimiter = new EnhancedRateLimiter();

// Executar limpeza a cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    enhancedRateLimiter.cleanup();
  }, 5 * 60 * 1000);
}
