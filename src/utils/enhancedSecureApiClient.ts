
import { supabase } from '@/integrations/supabase/client';
import { enhancedCsrfManager } from './enhancedCsrfProtection';
import { rateLimiter } from './secureAuth';
import { secureLog } from './secureLogger';
import { SecureFormValidator, formValidationRules } from './secureFormValidation';
import { sanitizeInput } from './securityEnhancements';
import { sanitizeHeroData } from './enhancedInputSanitization';

/**
 * Cliente API seguro aprimorado com validação e proteção robusta
 */

export class EnhancedSecureApiClient {
  private static instance: EnhancedSecureApiClient;
  
  static getInstance(): EnhancedSecureApiClient {
    if (!EnhancedSecureApiClient.instance) {
      EnhancedSecureApiClient.instance = new EnhancedSecureApiClient();
    }
    return EnhancedSecureApiClient.instance;
  }

  private async validateCSRFForMutation(): Promise<void> {
    const token = enhancedCsrfManager.getToken();
    if (!token || !enhancedCsrfManager.validateToken(token)) {
      throw new Error('Token CSRF inválido ou expirado');
    }

    // Renovar token se necessário
    if (enhancedCsrfManager.shouldRefreshToken()) {
      enhancedCsrfManager.refreshToken();
    }
  }

  async secureRequest<T>(
    operation: () => Promise<T>,
    operationType: string,
    userIdentifier?: string
  ): Promise<T> {
    // Para operações de configuração do sistema, não aplicar rate limiting
    if (operationType === 'UPDATE_ADMIN_SETTINGS' || operationType.includes('HERO_')) {
      try {
        const result = await operation();
        secureLog.info(`Operação ${operationType} realizada com sucesso`);
        return result;
      } catch (error) {
        secureLog.error(`Erro na operação ${operationType}`, error);
        throw error;
      }
    }

    const identifier = userIdentifier || 'anonymous';
    const rateLimitKey = `${operationType}_${identifier}`;

    // Rate limiting apenas para operações críticas
    if (await rateLimiter.isRateLimited(rateLimitKey)) {
      secureLog.warn('Rate limit excedido', { operationType, identifier: identifier.substring(0, 8) });
      throw new Error('Muitas tentativas. Aguarde um momento.');
    }

    // CSRF validation para operações de mutação
    if (['INSERT', 'UPDATE', 'DELETE', 'UPSERT'].includes(operationType.toUpperCase())) {
      await this.validateCSRFForMutation();
    }

    try {
      const result = await operation();
      secureLog.info(`Operação ${operationType} realizada com sucesso`);
      return result;
    } catch (error) {
      secureLog.error(`Erro na operação ${operationType}`, error);
      throw error;
    }
  }

  async secureProductOperation(productData: any, operation: 'CREATE' | 'UPDATE'): Promise<any> {
    return this.secureRequest(async () => {
      // Validação rigorosa dos dados
      const validator = new SecureFormValidator(formValidationRules.product);
      const { isValid, errors } = validator.validateForm(productData);
      
      if (!isValid) {
        const errorMessages = Object.values(errors).flat();
        throw new Error(`Dados inválidos: ${errorMessages.join(', ')}`);
      }

      // Sanitização completa dos dados
      const sanitizedData = {
        ...productData,
        name: sanitizeInput(productData.name, { maxLength: 200 }),
        brand: sanitizeInput(productData.brand, { maxLength: 100 }),
        category: sanitizeInput(productData.category, { maxLength: 100 }),
        description: productData.description ? 
          sanitizeInput(productData.description, { allowBasicHtml: true, maxLength: 5000 }) : null,
        custom_badge: productData.custom_badge ? 
          sanitizeInput(productData.custom_badge, { maxLength: 50 }) : null,
        movement: productData.movement ? 
          sanitizeInput(productData.movement, { maxLength: 50 }) : null,
        diameter: productData.diameter ? 
          sanitizeInput(productData.diameter, { maxLength: 20 }) : null,
        material: productData.material ? 
          sanitizeInput(productData.material, { maxLength: 50 }) : null,
        water_resistance: productData.water_resistance ? 
          sanitizeInput(productData.water_resistance, { maxLength: 30 }) : null
      };

      if (operation === 'CREATE') {
        const { data, error } = await supabase
          .from('products')
          .insert([sanitizedData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('products')
          .update(sanitizedData)
          .eq('id', productData.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    }, `${operation}_PRODUCT`);
  }

  async secureAdminSettingsUpdate(settings: Record<string, any>): Promise<any> {
    return this.secureRequest(async () => {
      // Processar cada configuração individualmente
      const results = [];
      for (const [key, value] of Object.entries(settings)) {
        const sanitizedKey = sanitizeInput(key, { maxLength: 100 });
        
        let sanitizedValue: string | number | boolean | null;
        
        // Para campos do hero, usar sanitização específica que preserva espaços
        if (key.startsWith('hero_')) {
          if (typeof value === 'string') {
            sanitizedValue = value; // Já foi sanitizado pelo sanitizeHeroData
          } else {
            sanitizedValue = value;
          }
        } else {
          // Para outros campos, usar sanitização padrão
          if (typeof value === 'string') {
            sanitizedValue = sanitizeInput(value, { maxLength: 1000, preserveSpaces: true });
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            sanitizedValue = value;
          } else {
            sanitizedValue = value ? String(value) : null;
          }
        }

        const { data, error } = await supabase
          .from('admin_settings')
          .upsert(
            { 
              setting_key: sanitizedKey,
              setting_value: sanitizedValue
            }, 
            { 
              onConflict: 'setting_key',
              ignoreDuplicates: false 
            }
          )
          .select();

        if (error) throw error;
        results.push(data);
      }

      return { success: true, results };
    }, 'UPDATE_ADMIN_SETTINGS');
  }

  async secureUserProfileOperation(profileData: any, operation: 'CREATE' | 'UPDATE'): Promise<any> {
    return this.secureRequest(async () => {
      // Sanitizar dados do perfil
      const sanitizedData = {
        id: profileData.id, // UUID não precisa sanitizar
        email: profileData.email ? sanitizeInput(profileData.email, { maxLength: 320 }) : null,
        full_name: profileData.full_name ? sanitizeInput(profileData.full_name, { maxLength: 200 }) : null,
        role: sanitizeInput(profileData.role || 'user', { maxLength: 50 })
      };

      // Validar role permitido
      if (!['admin', 'user'].includes(sanitizedData.role)) {
        throw new Error('Role inválido especificado');
      }

      if (operation === 'CREATE') {
        const { data, error } = await supabase
          .from('profiles')
          .insert([sanitizedData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .update(sanitizedData)
          .eq('id', profileData.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    }, `${operation}_PROFILE`);
  }
}

export const enhancedSecureApiClient = EnhancedSecureApiClient.getInstance();
