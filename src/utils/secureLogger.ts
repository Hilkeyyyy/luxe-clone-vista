
// Utilitário de logging seguro que remove informações sensíveis
interface LogData {
  [key: string]: any;
}

const SENSITIVE_FIELDS = [
  'password', 'token', 'email', 'user_id', 'id', 'phone', 
  'cpf', 'cnpj', 'credit_card', 'api_key', 'secret'
];

const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    // Mascarar emails
    if (value.includes('@')) {
      const [local, domain] = value.split('@');
      return `${local.slice(0, 2)}***@${domain}`;
    }
    // Mascarar tokens/IDs longos
    if (value.length > 10 && /^[a-zA-Z0-9-_]+$/.test(value)) {
      return `${value.slice(0, 4)}***${value.slice(-4)}`;
    }
  }
  return value;
};

const sanitizeObject = (obj: LogData): LogData => {
  const sanitized: LogData = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_FIELDS.some(field => lowerKey.includes(field));
    
    if (isSensitive) {
      sanitized[key] = '***';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = sanitizeValue(value);
    }
  }
  
  return sanitized;
};

export const secureLog = {
  info: (message: string, data?: LogData) => {
    console.info(message, data ? sanitizeObject(data) : undefined);
  },
  
  warn: (message: string, data?: LogData) => {
    console.warn(message, data ? sanitizeObject(data) : undefined);
  },
  
  error: (message: string, error?: any, data?: LogData) => {
    const sanitizedData = data ? sanitizeObject(data) : undefined;
    const sanitizedError = error?.message || 'Erro interno';
    console.error(message, { error: sanitizedError, ...sanitizedData });
  }
};
