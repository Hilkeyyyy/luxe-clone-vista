
// Cabeçalhos de segurança aprimorados
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.lovable.app",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.whatsapp.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Aplicar cabeçalhos de segurança
export const applySecurityHeaders = () => {
  if (typeof document !== 'undefined') {
    // Adicionar meta tags de segurança
    Object.entries(securityHeaders).forEach(([name, content]) => {
      const existingMeta = document.querySelector(`meta[http-equiv="${name}"]`);
      if (!existingMeta) {
        const meta = document.createElement('meta');
        meta.httpEquiv = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }
};
