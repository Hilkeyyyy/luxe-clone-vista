
import React, { useEffect } from 'react';
import { secureLog } from '@/utils/secureLogger';
import { applySecurityHeaders } from '@/utils/enhancedSecurityHeaders';

interface SecurityWrapperProps {
  children: React.ReactNode;
}

const SecurityWrapper: React.FC<SecurityWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Aplicar cabeçalhos de segurança
    applySecurityHeaders();
    
    // Validação de origem para produção
    const validateOrigin = () => {
      if (typeof window === 'undefined') return true;
      
      const currentOrigin = window.location.origin;
      
      // Permitir origens de desenvolvimento e Lovable
      const allowedOrigins = [
        'localhost',
        '127.0.0.1',
        '.lovable.app',
        'lovableproject.com'
      ];
      
      // Em desenvolvimento, permitir qualquer origem
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      
      // Em produção, verificar origem
      return allowedOrigins.some(allowed => currentOrigin.includes(allowed));
    };

    // Aplicar segurança apenas em produção externa
    if (process.env.NODE_ENV === 'production' && 
        !window.location.origin.includes('.lovable.app') && 
        !window.location.origin.includes('lovableproject.com')) {
      
      if (!validateOrigin()) {
        secureLog.warn('Acesso negado - origem não autorizada', { 
          origin: window.location.origin 
        });
        window.location.href = '/';
        return;
      }

      // Desabilitar console em produção
      if (typeof console !== 'undefined') {
        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
        console.info = () => {};
      }

      // Detectar e prevenir ataques de clickjacking
      if (window.top !== window.self) {
        secureLog.warn('Tentativa de clickjacking detectada');
        window.top!.location = window.location;
      }

      // Monitorar tentativas de acesso ao localStorage de outros domínios
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function(key: string, value: string) {
        // Log tentativas suspeitas
        if (key.includes('admin') || key.includes('token') || key.includes('secret')) {
          secureLog.warn('Tentativa suspeita de acesso ao localStorage', { key });
        }
        return originalSetItem.call(this, key, value);
      };

      // Desabilitar menu de contexto apenas em produção externa
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      // Desabilitar teclas de desenvolvedor
      const handleKeyDown = (e: KeyboardEvent) => {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    // Log inicialização do sistema de segurança
    secureLog.info('Sistema de segurança inicializado', {
      environment: process.env.NODE_ENV,
      origin: window.location.origin
    });
  }, []);

  return <>{children}</>;
};

export default SecurityWrapper;
