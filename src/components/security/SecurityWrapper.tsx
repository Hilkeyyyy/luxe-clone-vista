
import React, { useEffect } from 'react';
import { secureLog } from '@/utils/secureLogger';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

const SecurityWrapper: React.FC<SecurityWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Validação de origem mais flexível para desenvolvimento
    const validateOrigin = () => {
      if (typeof window === 'undefined') return true;
      
      const currentOrigin = window.location.origin;
      
      // Permitir qualquer origem do Lovable em desenvolvimento
      if (currentOrigin.includes('.lovable.app') || 
          currentOrigin.includes('lovableproject.com') ||
          currentOrigin.includes('localhost') ||
          currentOrigin.includes('127.0.0.1')) {
        return true;
      }
      
      return true; // Permitir qualquer origem para flexibilidade
    };

    // Só aplicar segurança restritiva em produção real
    if (process.env.NODE_ENV === 'production' && 
        !window.location.origin.includes('.lovable.app') && 
        !window.location.origin.includes('lovableproject.com')) {
      
      if (!validateOrigin()) {
        secureLog.warn('Acesso negado - origem não autorizada');
        window.location.href = '/';
        return;
      }

      // Headers de segurança apenas em produção externa
      const addSecurityMeta = () => {
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
          const cspMeta = document.createElement('meta');
          cspMeta.httpEquiv = 'Content-Security-Policy';
          cspMeta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' https://*.supabase.co https://*.lovable.app https://*.lovableproject.com ws: wss:; img-src 'self' data: https: blob:;";
          document.head.appendChild(cspMeta);
        }

        if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
          const frameMeta = document.createElement('meta');
          frameMeta.httpEquiv = 'X-Frame-Options';
          frameMeta.content = 'SAMEORIGIN';
          document.head.appendChild(frameMeta);
        }

        if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
          const contentTypeMeta = document.createElement('meta');
          contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
          contentTypeMeta.content = 'nosniff';
          document.head.appendChild(contentTypeMeta);
        }
      };

      addSecurityMeta();

      // Desabilitar menu de contexto apenas em produção externa
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
