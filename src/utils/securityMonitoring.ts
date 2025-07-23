
import { secureLog } from './secureLogger';

/**
 * Sistema de monitoramento de segurança simplificado
 */

export interface SecurityThreat {
  id: string;
  type: 'brute_force' | 'suspicious_activity' | 'rate_limit' | 'data_breach' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
}

export interface SecurityMetrics {
  totalThreats: number;
  activeThreatsByType: Record<string, number>;
  lastThreatTime: Date | null;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

class SecurityMonitoringService {
  private threats: SecurityThreat[] = [];
  private threatListeners: ((threat: SecurityThreat) => void)[] = [];
  private readonly maxThreatsInMemory = 100;

  constructor() {
    // Inicializar monitoramento
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Verificação periódica de segurança a cada 5 minutos
    setInterval(() => {
      this.performSecurityCheck();
    }, 5 * 60 * 1000);
  }

  private async performSecurityCheck(): Promise<void> {
    try {
      // Verificar tentativas de login suspeitas (simulado)
      const suspiciousActivity = this.detectSuspiciousActivity();
      
      if (suspiciousActivity) {
        this.reportThreat({
          type: 'suspicious_activity',
          severity: 'medium',
          description: 'Atividade suspeita detectada',
          details: { source: 'automated_check' }
        });
      }
    } catch (error) {
      secureLog.error('Erro durante verificação de segurança', error);
    }
  }

  private detectSuspiciousActivity(): boolean {
    // Lógica simplificada de detecção
    const now = Date.now();
    const recentThreats = this.threats.filter(
      threat => now - threat.timestamp.getTime() < 10 * 60 * 1000 // 10 minutos
    );
    
    return recentThreats.length > 5;
  }

  reportThreat(threat: Omit<SecurityThreat, 'id' | 'timestamp' | 'resolved'>): void {
    const newThreat: SecurityThreat = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false,
      ...threat
    };

    this.threats.unshift(newThreat);
    
    // Manter apenas as últimas ameaças na memória
    if (this.threats.length > this.maxThreatsInMemory) {
      this.threats = this.threats.slice(0, this.maxThreatsInMemory);
    }

    // Notificar listeners
    this.threatListeners.forEach(listener => {
      try {
        listener(newThreat);
      } catch (error) {
        secureLog.error('Erro ao notificar listener de ameaça', error);
      }
    });

    // Log da ameaça
    secureLog.warn('Nova ameaça de segurança detectada', {
      id: newThreat.id,
      type: newThreat.type,
      severity: newThreat.severity,
      description: newThreat.description
    });
  }

  getRecentThreats(limit: number = 10): SecurityThreat[] {
    return this.threats.slice(0, limit);
  }

  getThreatsByType(type: SecurityThreat['type']): SecurityThreat[] {
    return this.threats.filter(threat => threat.type === type);
  }

  getSecurityMetrics(): SecurityMetrics {
    const activeThreatsByType: Record<string, number> = {};
    const activeThreats = this.threats.filter(threat => !threat.resolved);

    activeThreats.forEach(threat => {
      activeThreatsByType[threat.type] = (activeThreatsByType[threat.type] || 0) + 1;
    });

    const criticalThreats = activeThreats.filter(threat => threat.severity === 'critical');
    const highThreats = activeThreats.filter(threat => threat.severity === 'high');

    let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (criticalThreats.length > 0) {
      systemHealth = 'critical';
    } else if (highThreats.length > 0 || activeThreats.length > 10) {
      systemHealth = 'warning';
    }

    return {
      totalThreats: this.threats.length,
      activeThreatsByType,
      lastThreatTime: this.threats.length > 0 ? this.threats[0].timestamp : null,
      systemHealth
    };
  }

  resolveThreat(threatId: string): boolean {
    const threat = this.threats.find(t => t.id === threatId);
    if (threat) {
      threat.resolved = true;
      secureLog.info('Ameaça resolvida', { threatId });
      return true;
    }
    return false;
  }

  clearThreats(): void {
    this.threats = [];
    secureLog.info('Todas as ameaças foram limpas');
  }

  addThreatListener(listener: (threat: SecurityThreat) => void): void {
    this.threatListeners.push(listener);
  }

  removeThreatListener(listener: (threat: SecurityThreat) => void): void {
    const index = this.threatListeners.indexOf(listener);
    if (index > -1) {
      this.threatListeners.splice(index, 1);
    }
  }

  async performSecurityHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      const metrics = this.getSecurityMetrics();
      const activeThreats = this.threats.filter(threat => !threat.resolved);

      // Verificar ameaças críticas
      const criticalThreats = activeThreats.filter(threat => threat.severity === 'critical');
      if (criticalThreats.length > 0) {
        issues.push(`${criticalThreats.length} ameaças críticas ativas`);
        recommendations.push('Resolver imediatamente as ameaças críticas');
      }

      // Verificar ameaças de alta severidade
      const highThreats = activeThreats.filter(threat => threat.severity === 'high');
      if (highThreats.length > 2) {
        issues.push(`${highThreats.length} ameaças de alta severidade`);
        recommendations.push('Investigar e resolver ameaças de alta severidade');
      }

      // Verificar volume de ameaças
      if (activeThreats.length > 10) {
        issues.push('Volume alto de ameaças ativas');
        recommendations.push('Revisar configurações de segurança');
      }

      return {
        status: metrics.systemHealth,
        issues,
        recommendations
      };
    } catch (error) {
      secureLog.error('Erro durante verificação de saúde de segurança', error);
      return {
        status: 'critical',
        issues: ['Erro ao verificar status de segurança'],
        recommendations: ['Verificar logs do sistema']
      };
    }
  }
}

export const securityMonitor = new SecurityMonitoringService();
