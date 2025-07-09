
import { secureLog } from './secureLogger';

/**
 * Proteção CSRF aprimorada com rotação de tokens
 */

class EnhancedCSRFManager {
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private readonly TOKEN_LIFETIME = 30 * 60 * 1000; // 30 minutos

  generateToken(): string {
    this.token = crypto.randomUUID() + '-' + Date.now();
    this.tokenExpiry = Date.now() + this.TOKEN_LIFETIME;
    
    sessionStorage.setItem('csrf-token', this.token);
    sessionStorage.setItem('csrf-expiry', this.tokenExpiry.toString());
    
    secureLog.info('Novo token CSRF gerado');
    return this.token;
  }

  getToken(): string | null {
    const storedToken = sessionStorage.getItem('csrf-token');
    const storedExpiry = sessionStorage.getItem('csrf-expiry');

    if (!storedToken || !storedExpiry) {
      return this.generateToken();
    }

    const expiry = parseInt(storedExpiry, 10);
    if (Date.now() > expiry) {
      secureLog.info('Token CSRF expirado, gerando novo');
      return this.generateToken();
    }

    this.token = storedToken;
    this.tokenExpiry = expiry;
    return this.token;
  }

  validateToken(token: string): boolean {
    const currentToken = this.getToken();
    const isValid = currentToken === token && token !== null && Date.now() < this.tokenExpiry;
    
    if (!isValid) {
      secureLog.warn('Validação de token CSRF falhou', { 
        hasToken: !!token,
        tokenLength: token?.length || 0
      });
    }

    return isValid;
  }

  refreshToken(): string {
    this.clearToken();
    return this.generateToken();
  }

  clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
    sessionStorage.removeItem('csrf-token');
    sessionStorage.removeItem('csrf-expiry');
    secureLog.info('Token CSRF limpo');
  }

  // Validar se o token precisa ser renovado
  shouldRefreshToken(): boolean {
    const timeUntilExpiry = this.tokenExpiry - Date.now();
    const refreshThreshold = 5 * 60 * 1000; // 5 minutos
    return timeUntilExpiry < refreshThreshold;
  }
}

export const enhancedCsrfManager = new EnhancedCSRFManager();

// Interceptador para requests automáticos
export const addCSRFToRequest = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = enhancedCsrfManager.getToken();
  if (token) {
    headers['X-CSRF-Token'] = token;
  }
  return headers;
};

// Hook para usar em componentes React
export const useCSRFToken = () => {
  const getToken = () => enhancedCsrfManager.getToken();
  const validateToken = (token: string) => enhancedCsrfManager.validateToken(token);
  const refreshToken = () => enhancedCsrfManager.refreshToken();
  
  return { getToken, validateToken, refreshToken };
};
