
// Configurações centralizadas de segurança
export const SECURITY_CONFIG = {
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 5,
  RATE_LIMIT_WINDOW_MS: 60000,
  
  // Session security
  MAX_SESSION_AGE_MS: 86400000, // 24 horas
  SESSION_CHECK_INTERVAL_MS: 300000, // 5 minutos
  
  // Password requirements
  MIN_PASSWORD_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
  MAX_PASSWORD_LENGTH: 128,
  
  // Input validation
  MAX_INPUT_LENGTH: 1000,
  MAX_EMAIL_LENGTH: 320,
  MAX_NAME_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 5000,
  
  // CSRF protection
  CSRF_TOKEN_LENGTH: 32,
  
  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'https://preview--luxe-clone-vista.lovable.app',
    'https://luxe-clone-vista.lovable.app'
  ],
  
  // File upload limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Sensitive field patterns for logging
  SENSITIVE_FIELD_PATTERNS: [
    /password/i,
    /token/i,
    /secret/i,
    /key/i,
    /auth/i,
    /credential/i
  ]
} as const;

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};
