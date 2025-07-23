
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogger';
import { logSecurityEvent } from './enhancedSecurityValidation';

/**
 * Sistema de monitoramento de segurança em tempo real
 */

export interface SecurityThreat {
  type: 'suspicious_activity' | 'multiple_login_attempts' | 'unusual_access_pattern' | 'potential_attack';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

class SecurityMonitor {
  private threats: SecurityThreat[] = [];
  private listeners: ((threat: SecurityThreat) => void)[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    // Monitorar a cada 30 segundos
    this.monitoringInterval = setInterval(() => {
      this.checkForThreats();
    }, 30000);
  }

  private async checkForThreats(): Promise<void> {
    try {
      await this.checkSuspiciousLoginAttempts();
      await this.checkUnusualAccessPatterns();
      await this.validateSessionIntegrity();
    } catch (error) {
      secureLog.error('Erro durante monitoramento de segurança', error);
    }
  }

  private async checkSuspiciousLoginAttempts(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verificar tentativas de login recentes
      const { data: attempts, error } = await supabase
        .from('login_attempts')
        .select('*')
        .eq('email', user.email)
        .gte('attempt_time', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Última hora
        .order('attempt_time', { ascending: false });

      if (error) {
        secureLog.error('Erro ao verificar tentativas de login', error);
        return;
      }

      if (attempts && attempts.length > 10) {
        const threat: SecurityThreat = {
          type: 'multiple_login_attempts',
          severity: 'high',
          description: `Múltiplas tentativas de login detectadas (${attempts.length} tentativas na última hora)`,
          timestamp: new Date(),
          userId: user.id
        };

        this.reportThreat(threat);
      }
    } catch (error) {
      secureLog.error('Erro ao verificar tentativas de login suspeitas', error);
    }
  }

  private async checkUnusualAccessPatterns(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verificar padrões de acesso incomuns
      const { data: auditLogs, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Últimas 24 horas
        .order('created_at', { ascending: false });

      if (error) {
        secureLog.error('Erro ao verificar logs de auditoria', error);
        return;
      }

      if (auditLogs && auditLogs.length > 50) {
        const threat: SecurityThreat = {
          type: 'unusual_access_pattern',
          severity: 'medium',
          description: `Padrão de acesso incomum detectado (${auditLogs.length} ações nas últimas 24h)`,
          timestamp: new Date(),
          userId: user.id
        };

        this.reportThreat(threat);
      }
    } catch (error) {
      secureLog.error('Erro ao verificar padrões de acesso', error);
    }
  }

  private async validateSessionIntegrity(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      // Verificar se a sessão está próxima do vencimento
      const expiresAt = new Date(session.expires_at || 0);
      const now = new Date();
      const timeToExpiry = expiresAt.getTime() - now.getTime();
      
      // Se a sessão expira em menos de 5 minutos, alertar
      if (timeToExpiry < 5 * 60 * 1000 && timeToExpiry > 0) {
        const threat: SecurityThreat = {
          type: 'suspicious_activity',
          severity: 'low',
          description: 'Sessão próxima do vencimento',
          timestamp: new Date(),
          userId: session.user.id
        };

        this.reportThreat(threat);
      }
    } catch (error) {
      secureLog.error('Erro ao validar integridade da sessão', error);
    }
  }

  private reportThreat(threat: SecurityThreat): void {
    // Adicionar à lista de ameaças
    this.threats.push(threat);
    
    // Manter apenas as últimas 100 ameaças
    if (this.threats.length > 100) {
      this.threats = this.threats.slice(-100);
    }

    // Registrar evento de segurança
    logSecurityEvent('security_threat_detected', {
      type: threat.type,
      severity: threat.severity,
      description: threat.description
    });

    // Notificar listeners
    this.listeners.forEach(listener => {
      try {
        listener(threat);
      } catch (error) {
        secureLog.error('Erro ao notificar listener de segurança', error);
      }
    });

    // Log da ameaça
    secureLog.warn('Ameaça de segurança detectada', {
      type: threat.type,
      severity: threat.severity,
      description: threat.description
    });
  }

  public addThreatListener(listener: (threat: SecurityThreat) => void): void {
    this.listeners.push(listener);
  }

  public removeThreatListener(listener: (threat: SecurityThreat) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  public getRecentThreats(limit: number = 10): SecurityThreat[] {
    return this.threats.slice(-limit).reverse();
  }

  public clearThreats(): void {
    this.threats = [];
  }

  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  public async performSecurityHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Verificar sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        issues.push('Nenhuma sessão ativa encontrada');
        recommendations.push('Fazer login novamente');
        return { status: 'warning', issues, recommendations };
      }

      // Verificar se a sessão expira em breve
      const expiresAt = new Date(session.expires_at || 0);
      const now = new Date();
      const timeToExpiry = expiresAt.getTime() - now.getTime();
      
      if (timeToExpiry < 10 * 60 * 1000) { // 10 minutos
        issues.push('Sessão expirando em breve');
        recommendations.push('Renovar sessão automaticamente');
      }

      // Verificar ameaças recentes
      const recentThreats = this.getRecentThreats(5);
      const criticalThreats = recentThreats.filter(t => t.severity === 'critical');
      
      if (criticalThreats.length > 0) {
        issues.push(`${criticalThreats.length} ameaças críticas detectadas`);
        recommendations.push('Revisar atividade recente e alterar credenciais');
        return { status: 'critical', issues, recommendations };
      }

      const highThreats = recentThreats.filter(t => t.severity === 'high');
      if (highThreats.length > 0) {
        issues.push(`${highThreats.length} ameaças de alta prioridade detectadas`);
        recommendations.push('Monitorar atividade e considerar medidas preventivas');
        return { status: 'warning', issues, recommendations };
      }

      return { status: 'healthy', issues, recommendations };
    } catch (error) {
      secureLog.error('Erro durante verificação de saúde de segurança', error);
      return {
        status: 'critical',
        issues: ['Erro interno durante verificação de segurança'],
        recommendations: ['Contactar suporte técnico']
      };
    }
  }
}

export const securityMonitor = new SecurityMonitor();

// Limpar monitoramento quando a janela for fechada
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    securityMonitor.stopMonitoring();
  });
}
