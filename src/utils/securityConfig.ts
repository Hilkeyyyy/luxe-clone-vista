
export const SECURITY_CONFIG = {
  // Session security
  SESSION_CHECK_INTERVAL_MS: 5 * 60 * 1000, // 5 minutos
  SESSION_TIMEOUT_MS: 24 * 60 * 60 * 1000, // 24 horas
  
  // CSRF protection
  CSRF_TOKEN_LENGTH: 32,
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_MS: 15 * 60 * 1000, // 15 minutos
  
  // Input validation
  MAX_INPUT_LENGTH: 1000,
  MAX_EMAIL_LENGTH: 320,
  MAX_PASSWORD_LENGTH: 128,
  MIN_PASSWORD_LENGTH: 6,
  
  // Admin security
  ADMIN_SESSION_TIMEOUT_MS: 2 * 60 * 60 * 1000, // 2 horas
  
  // Allowed origins for security validation
  ALLOWED_ORIGINS: [
    window.location.origin,
    'https://cfzlalckxzmfdxrpnirg.supabase.co'
  ]
} as const;
