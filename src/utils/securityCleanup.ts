
import { cleanupExpiredTokens } from './enhancedSecurityValidation';
import { secureLog } from './secureLogger';
import { cleanAuthState } from './secureAuth';

/**
 * Sistema de limpeza automática de segurança
 */

class SecurityCleanupManager {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.startAutomaticCleanup();
  }

  private startAutomaticCleanup(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Executar limpeza a cada 30 minutos
    this.cleanupInterval = setInterval(() => {
      this.performFullCleanup();
    }, 30 * 60 * 1000);

    // Executar limpeza inicial após 30 segundos
    setTimeout(() => {
      this.performFullCleanup();
    }, 30000);
  }

  private async performFullCleanup(): Promise<void> {
    try {
      secureLog.info('Iniciando limpeza automática de segurança');

      // 1. Limpar tokens expirados no banco
      await cleanupExpiredTokens();

      // 2. Limpar estado de autenticação local se necessário
      await this.cleanupLocalAuthState();

      // 3. Limpar cache de segurança
      this.cleanupSecurityCache();

      // 4. Validar integridade da sessão
      await this.validateAndCleanupSession();

      secureLog.info('Limpeza automática de segurança concluída');
    } catch (error) {
      secureLog.error('Erro durante limpeza automática de segurança', error);
    }
  }

  private async cleanupLocalAuthState(): Promise<void> {
    try {
      // Verificar se há tokens expirados no localStorage
      const authKeys = [
        'supabase.auth.token',
        'sb-cfzlalckxzmfdxrpnirg-auth-token',
        'supabase.auth.session',
        'sb-cfzlalckxzmfdxrpnirg-auth-session'
      ];

      for (const key of authKeys) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            
            // Verificar se o token está expirado
            if (parsed.expires_at && new Date(parsed.expires_at) < new Date()) {
              localStorage.removeItem(key);
              secureLog.info('Token expirado removido do localStorage', { key });
            }
          }
        } catch (error) {
          // Se não conseguir parsear, remover o item
          localStorage.removeItem(key);
          secureLog.warn('Item inválido removido do localStorage', { key });
        }
      }
    } catch (error) {
      secureLog.error('Erro ao limpar estado de autenticação local', error);
    }
  }

  private cleanupSecurityCache(): void {
    try {
      // Limpar cache de validação de senhas antigas
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const securityKeys = [];
        
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('security_')) {
            securityKeys.push(key);
          }
        }
        
        securityKeys.forEach(key => {
          try {
            const value = sessionStorage.getItem(key);
            if (value) {
              const parsed = JSON.parse(value);
              
              // Remover itens mais antigos que 1 hora
              if (parsed.timestamp && Date.now() - parsed.timestamp > 60 * 60 * 1000) {
                sessionStorage.removeItem(key);
                secureLog.info('Cache de segurança expirado removido', { key });
              }
            }
          } catch (error) {
            // Se não conseguir parsear, remover
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      secureLog.error('Erro ao limpar cache de segurança', error);
    }
  }

  private async validateAndCleanupSession(): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Se não há sessão, limpar qualquer estado residual
        cleanAuthState();
        return;
      }

      // Verificar se a sessão está próxima do vencimento (menos de 5 minutos)
      const expiresAt = new Date(session.expires_at || 0);
      const now = new Date();
      const timeToExpiry = expiresAt.getTime() - now.getTime();
      
      if (timeToExpiry < 5 * 60 * 1000) {
        secureLog.info('Sessão próxima do vencimento - tentando renovar');
        
        try {
          const { error } = await supabase.auth.refreshSession();
          if (error) {
            secureLog.error('Erro ao renovar sessão', error);
            cleanAuthState();
          } else {
            secureLog.info('Sessão renovada com sucesso');
          }
        } catch (error) {
          secureLog.error('Erro crítico ao renovar sessão', error);
          cleanAuthState();
        }
      }
    } catch (error) {
      secureLog.error('Erro ao validar sessão', error);
    }
  }

  public stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.isRunning = false;
  }

  public async performManualCleanup(): Promise<void> {
    await this.performFullCleanup();
  }
}

export const securityCleanupManager = new SecurityCleanupManager();

// Limpar quando a janela for fechada
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    securityCleanupManager.stopCleanup();
  });
}
