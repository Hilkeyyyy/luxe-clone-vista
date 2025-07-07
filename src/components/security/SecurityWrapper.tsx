
import React, { useEffect } from 'react';
import { secureLog } from '@/utils/secureLogger';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

const SecurityWrapper: React.FC<SecurityWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Validação de origem mais flexível para preview e desenvolvimento
    const validateOrigin = () => {
      if (typeof window === 'undefined') return true;
      
      const currentOrigin = window.location.origin;
      const allowedOrigins = [
        currentOrigin,
        'https://localhost:3000',
        'https://127.0.0.1:3000',
        // Permitir domínios do Lovable preview
        'https://preview--luxe-clone-vista.lovable.app',
        'https://luxe-clone-vista.lovable.app'
      ];
      
      // Em desenvolvimento, permitir qualquer origem do Lovable
      if (currentOrigin.includes('.lovable.app') || currentOrigin.includes('lovableproject.com')) {
        return true;
      }
      
      return allowedOrigins.some(origin => currentOrigin.startsWith(origin));
    };

    // Apenas validar origem em produção
    if (process.env.NODE_ENV === 'production' && !validateOrigin()) {
      secureLog.warn('Acesso negado - origem não autorizada');
      window.location.href = '/';
      return;
    }

    // Headers de segurança apenas em produção
    if (process.env.NODE_ENV === 'production') {
      const addSecurityMeta = () => {
        // CSP mais flexível para desenvolvimento
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
          const cspMeta = document.createElement('meta');
          cspMeta.httpEquiv = 'Content-Security-Policy';
          cspMeta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' https://*.supabase.co https://*.lovable.app https://*.lovableproject.com ws: wss:; img-src 'self' data: https: blob:;";
          document.head.appendChild(cspMeta);
        }

        // X-Frame-Options
        if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
          const frameMeta = document.createElement('meta');
          frameMeta.httpEquiv = 'X-Frame-Options';
          frameMeta.content = 'SAMEORIGIN';
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
    }

    // Desabilitar menu de contexto apenas em produção
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
