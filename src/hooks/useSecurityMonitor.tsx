
import { useEffect, useState } from 'react';
import { secureLog } from '@/utils/secureLogger';
import { validateRequestOrigin } from '@/utils/securityHeaders';
import { SECURITY_CONFIG } from '@/utils/securityConfig';

interface SecurityStatus {
  originValid: boolean;
  csrfProtected: boolean;
  sessionSecure: boolean;
  lastCheck: Date;
}

export const useSecurityMonitor = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    originValid: true,
    csrfProtected: true,
    sessionSecure: true,
    lastCheck: new Date()
  });

  useEffect(() => {
    const performSecurityCheck = () => {
      try {
        const originValid = validateRequestOrigin();
        const csrfToken = sessionStorage.getItem('csrf-token');
        const csrfProtected = !!csrfToken && csrfToken.length >= SECURITY_CONFIG.CSRF_TOKEN_LENGTH;

        const newStatus: SecurityStatus = {
          originValid,
          csrfProtected,
          sessionSecure: originValid && csrfProtected,
          lastCheck: new Date()
        };

        setSecurityStatus(newStatus);

        if (!newStatus.sessionSecure) {
          secureLog.warn('Security check failed', {
            originValid,
            csrfProtected
          });
        }
      } catch (error) {
        secureLog.error('Security monitor error', error);
        setSecurityStatus(prev => ({
          ...prev,
          sessionSecure: false,
          lastCheck: new Date()
        }));
      }
    };

    // Verificação inicial
    performSecurityCheck();

    // Verificação periódica
    const interval = setInterval(performSecurityCheck, SECURITY_CONFIG.SESSION_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return securityStatus;
};
