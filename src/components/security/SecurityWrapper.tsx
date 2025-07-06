
import React, { useEffect } from 'react';
import { validateRequestOrigin } from '@/utils/securityHeaders';
import { secureLog } from '@/utils/secureLogger';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

const SecurityWrapper: React.FC<SecurityWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Security headers validation
    if (!validateRequestOrigin()) {
      secureLog.warn('Acesso negado - origem não autorizada');
      window.location.href = '/';
      return;
    }

    // Add security-related meta tags
    const addSecurityMeta = () => {
      // Content Security Policy
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://cfzlalckxzmfdxrpnirg.supabase.co";
        document.head.appendChild(cspMeta);
      }

      // X-Frame-Options
      if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        const frameMeta = document.createElement('meta');
        frameMeta.httpEquiv = 'X-Frame-Options';
        frameMeta.content = 'DENY';
        document.head.appendChild(frameMeta);
      }

      // X-Content-Type-Options
      if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        const contentTypeMeta = document.createElement('meta');
        contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
        contentTypeMeta.content = 'nosniff';
        document.head.appendChild(contentTypeMeta);
      }
    };

    addSecurityMeta();

    // Disable right-click context menu in production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  return <>{children}</>;
};

export default SecurityWrapper;
