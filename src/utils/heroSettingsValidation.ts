import { sanitizeInput } from './securityEnhancements';
import { secureLog } from './secureLogger';

/**
 * Validação específica para configurações do hero
 */

export interface HeroSettingsData {
  hero_title?: string;
  hero_subtitle?: string;
  hero_button_primary_text?: string;
  hero_button_secondary_text?: string;
  hero_background_image?: string;
  hero_text_position?: string;
  hero_overlay_opacity?: number;
}

export const validateHeroSettings = (settings: Record<string, any>): HeroSettingsData => {
  const validated: HeroSettingsData = {};

  // Validar título (preservando espaços)
  if (settings.hero_title && typeof settings.hero_title === 'string') {
    validated.hero_title = sanitizeInput(settings.hero_title, { 
      maxLength: 200, 
      preserveSpaces: true 
    });
  }

  // Validar subtítulo (preservando espaços)
  if (settings.hero_subtitle && typeof settings.hero_subtitle === 'string') {
    validated.hero_subtitle = sanitizeInput(settings.hero_subtitle, { 
      maxLength: 300, 
      preserveSpaces: true 
    });
  }

  // Validar texto do botão primário (preservando espaços)
  if (settings.hero_button_primary_text && typeof settings.hero_button_primary_text === 'string') {
    validated.hero_button_primary_text = sanitizeInput(settings.hero_button_primary_text, { 
      maxLength: 50, 
      preserveSpaces: true 
    });
  }

  // Validar texto do botão secundário (preservando espaços)
  if (settings.hero_button_secondary_text && typeof settings.hero_button_secondary_text === 'string') {
    validated.hero_button_secondary_text = sanitizeInput(settings.hero_button_secondary_text, { 
      maxLength: 50, 
      preserveSpaces: true 
    });
  }

  // Validar URL da imagem de fundo
  if (settings.hero_background_image && typeof settings.hero_background_image === 'string') {
    const imageUrl = settings.hero_background_image.trim();
    if (imageUrl === '' || isValidImageUrl(imageUrl)) {
      validated.hero_background_image = imageUrl;
    } else {
      secureLog.warn('URL de imagem inválida para hero', { url: imageUrl.substring(0, 50) });
      validated.hero_background_image = '';
    }
  }

  // Validar posição do texto
  if (settings.hero_text_position && typeof settings.hero_text_position === 'string') {
    const position = settings.hero_text_position.toLowerCase();
    if (['left', 'center', 'right'].includes(position)) {
      validated.hero_text_position = position;
    } else {
      validated.hero_text_position = 'center';
    }
  }

  // Validar opacidade da sobreposição
  if (typeof settings.hero_overlay_opacity === 'number') {
    const opacity = Math.max(0, Math.min(100, settings.hero_overlay_opacity));
    validated.hero_overlay_opacity = opacity;
  }

  return validated;
};

const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    
    // Permitir apenas URLs do Supabase ou HTTPS
    const isSupabase = parsedUrl.hostname.includes('supabase.co');
    const isHttps = parsedUrl.protocol === 'https:';
    
    if (!isSupabase && !isHttps) {
      return false;
    }

    // Verificar extensões de imagem
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasImageExtension = imageExtensions.some(ext => 
      parsedUrl.pathname.toLowerCase().includes(ext)
    );

    return hasImageExtension;
  } catch {
    return false;
  }
};

export const sanitizeHeroSettingsForSave = (settings: HeroSettingsData): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  Object.entries(settings).forEach(([key, value]) => {
    if (value !== undefined) {
      sanitized[key] = value;
    }
  });

  return sanitized;
};