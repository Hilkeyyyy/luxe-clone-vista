
// Utilitário para validação de origem e headers de segurança
export const validateRequestOrigin = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const allowedOrigins = [
    window.location.origin,
    'https://localhost:3000',
    'https://127.0.0.1:3000'
  ];
  
  return allowedOrigins.includes(window.location.origin);
};

export const addSecurityHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

export const validateCSRFToken = (token?: string): boolean => {
  if (!token) return false;
  // Implementação básica de validação CSRF
  const expectedLength = 32;
  return token.length === expectedLength && /^[a-zA-Z0-9]+$/.test(token);
};
