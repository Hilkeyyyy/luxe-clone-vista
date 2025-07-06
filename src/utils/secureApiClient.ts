
import { supabase } from '@/integrations/supabase/client';
import { csrfManager, sanitizeInput } from './securityEnhancements';
import { rateLimiter } from './security';
import { secureLog } from './secureLogger';

export class SecureApiClient {
  private static instance: SecureApiClient;
  
  static getInstance(): SecureApiClient {
    if (!SecureApiClient.instance) {
      SecureApiClient.instance = new SecureApiClient();
    }
    return SecureApiClient.instance;
  }

  async secureRequest<T>(
    operation: () => Promise<T>,
    operationType: string,
    userIdentifier?: string
  ): Promise<T> {
    const identifier = userIdentifier || 'anonymous';
    const rateLimitKey = `${operationType}_${identifier}`;

    // Rate limiting
    if (rateLimiter.isRateLimited(rateLimitKey)) {
      throw new Error('Muitas tentativas. Aguarde um momento.');
    }

    // CSRF validation for state-changing operations
    if (['INSERT', 'UPDATE', 'DELETE'].includes(operationType.toUpperCase())) {
      const csrfToken = csrfManager.getToken();
      if (!csrfToken) {
        throw new Error('Token CSRF inválido');
      }
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

  async secureProductCreate(productData: any): Promise<any> {
    return this.secureRequest(async () => {
      // Sanitize all string inputs
      const sanitizedData = {
        ...productData,
        name: sanitizeInput(productData.name, { maxLength: 200 }),
        brand: sanitizeInput(productData.brand, { maxLength: 100 }),
        category: sanitizeInput(productData.category, { maxLength: 100 }),
        description: productData.description ? 
          sanitizeInput(productData.description, { allowBasicHtml: true, maxLength: 5000 }) : null,
        custom_badge: productData.custom_badge ? 
          sanitizeInput(productData.custom_badge, { maxLength: 50 }) : null
      };

      const { data, error } = await supabase
        .from('products')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'CREATE_PRODUCT');
  }

  async secureAdminSettingsUpdate(settings: any): Promise<any> {
    return this.secureRequest(async () => {
      // Update settings one by one for better security and type safety
      for (const [key, value] of Object.entries(settings)) {
        const sanitizedKey = sanitizeInput(key, { maxLength: 100 });
        
        // Convert value to proper Json type
        let sanitizedValue: string | number | boolean | null;
        if (typeof value === 'string') {
          sanitizedValue = sanitizeInput(value as string, { maxLength: 1000 });
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          sanitizedValue = value as number | boolean;
        } else {
          sanitizedValue = value ? String(value) : null;
        }

        const { error } = await supabase
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
          );

        if (error) throw error;
      }

      return { success: true };
    }, 'UPDATE_ADMIN_SETTINGS');
  }
}

export const secureApiClient = SecureApiClient.getInstance();
