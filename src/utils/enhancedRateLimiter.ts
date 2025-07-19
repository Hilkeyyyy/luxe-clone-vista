
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

  // Log tentativas de login (simplificado sem banco de dados por enquanto)
  async logLoginAttempt(email: string, success: boolean, ipAddress?: string) {
    try {
      // Por enquanto, apenas log no console até os tipos serem atualizados
      secureLog.info('Tentativa de login registrada', {
        email: email.substring(0, 10),
        success,
        ipAddress: ipAddress?.substring(0, 10)
      });
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

  // Verificar tentativas recentes (simplificado sem banco por enquanto)
  async checkRecentAttempts(email: string): Promise<boolean> {
    try {
      // Implementação simplificada usando localStorage como fallback
      const storageKey = `failed_attempts_${email}`;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return false;
      
      const data = JSON.parse(stored);
      const fifteenMinutesAgo = Date.now() - this.windowMs;
      
      // Filtrar tentativas recentes
      const recentAttempts = data.attempts?.filter((attempt: any) => 
        attempt.timestamp > fifteenMinutesAgo && !attempt.success
      ) || [];
      
      return recentAttempts.length >= this.maxAttempts;
    } catch (error) {
      secureLog.error('Erro ao verificar tentativas recentes', error);
      return false;
    }
  }

  // Adicionar tentativa ao localStorage
  private addAttemptToStorage(email: string, success: boolean) {
    try {
      const storageKey = `failed_attempts_${email}`;
      const stored = localStorage.getItem(storageKey) || '{"attempts": []}';
      const data = JSON.parse(stored);
      
      data.attempts = data.attempts || [];
      data.attempts.push({
        timestamp: Date.now(),
        success
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
}

export const enhancedRateLimiter = new EnhancedRateLimiter();
