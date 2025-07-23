
import { useEffect, useState } from 'react';
import { securityMonitor, SecurityThreat } from '@/utils/securityMonitoring';
import { secureLog } from '@/utils/secureLogger';

export const useSecurityMonitoring = () => {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [healthStatus, setHealthStatus] = useState<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }>({
    status: 'healthy',
    issues: [],
    recommendations: []
  });

  useEffect(() => {
    // Carregar ameaças iniciais
    setThreats(securityMonitor.getRecentThreats(10));

    // Listener para novas ameaças
    const handleNewThreat = (threat: SecurityThreat) => {
      setThreats(prev => [threat, ...prev.slice(0, 9)]);
    };

    securityMonitor.addThreatListener(handleNewThreat);

    // Verificação inicial de saúde
    const checkInitialHealth = async () => {
      try {
        const health = await securityMonitor.performSecurityHealthCheck();
        setHealthStatus(health);
      } catch (error) {
        secureLog.error('Erro ao verificar saúde inicial de segurança', error);
      }
    };

    checkInitialHealth();

    // Verificação periódica de saúde (a cada 5 minutos)
    const healthCheckInterval = setInterval(async () => {
      try {
        const health = await securityMonitor.performSecurityHealthCheck();
        setHealthStatus(health);
      } catch (error) {
        secureLog.error('Erro durante verificação periódica de saúde', error);
      }
    }, 5 * 60 * 1000);

    return () => {
      securityMonitor.removeThreatListener(handleNewThreat);
      clearInterval(healthCheckInterval);
    };
  }, []);

  const clearThreats = () => {
    securityMonitor.clearThreats();
    setThreats([]);
  };

  const refreshHealthStatus = async () => {
    try {
      const health = await securityMonitor.performSecurityHealthCheck();
      setHealthStatus(health);
    } catch (error) {
      secureLog.error('Erro ao atualizar status de saúde', error);
    }
  };

  return {
    threats,
    healthStatus,
    clearThreats,
    refreshHealthStatus
  };
};
