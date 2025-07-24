import { supabase } from '@/integrations/supabase/client';
import { csrfManager, sanitizeInput } from './securityEnhancements';
import { rateLimiter } from './security';
import { secureLog } from './secureLogger';
import { validateProductData, validateAdminSettings } from './enhancedSecurityValidation';

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
      // Validar dados do produto
      const validationErrors = validateProductData(productData);
      if (validationErrors.length > 0) {
        throw new Error(`Dados inválidos: ${validationErrors.join(', ')}`);
      }

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

      console.log('🔄 Criando produto com dados sanitizados:', sanitizedData);

      // CRIAR/OBTER CATEGORIA DE MARCA AUTOMATICAMENTE
      console.log('🏷️ Criando/obtendo categoria de marca para:', sanitizedData.brand);
      
      try {
        const { data: brandCategoryId, error: brandCategoryError } = await supabase
          .rpc('get_or_create_brand_category', {
            category_name: sanitizedData.brand
          });

        if (brandCategoryError) {
          console.error('❌ Erro ao criar/obter categoria de marca:', brandCategoryError);
          // Não falhar a operação, apenas logar o erro
          console.warn('⚠️ Continuando sem categoria de marca...');
        } else if (brandCategoryId) {
          console.log('✅ Categoria de marca criada/obtida com ID:', brandCategoryId);
          // Adicionar brand_category_id aos dados do produto
          sanitizedData.brand_category_id = brandCategoryId;
        }
      } catch (categoryError) {
        console.error('❌ Erro na função get_or_create_brand_category:', categoryError);
        console.warn('⚠️ Continuando sem categoria de marca...');
      }

      console.log('🔄 Inserindo produto (com ou sem categoria):', sanitizedData);

      // Inserir produto
      const { data, error } = await supabase
        .from('products')
        .insert([sanitizedData])
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao inserir produto:', error);
        throw error;
      }

      if (!data) {
        console.error('❌ Nenhum dado retornado após inserção');
        throw new Error('Produto não foi criado. Verifique as permissões.');
      }

      console.log('✅ Produto criado com sucesso:', data);
      
      // Atualizar contagem de produtos nas categorias
      try {
        await supabase.rpc('update_brand_category_products_count');
        console.log('✅ Contagem de produtos atualizada');
      } catch (countError) {
        console.warn('⚠️ Erro ao atualizar contagem (não crítico):', countError);
      }

      return data;
    }, 'CREATE_PRODUCT');
  }

  async secureAdminSettingsUpdate(settings: any): Promise<any> {
    return this.secureRequest(async () => {
      // Validar configurações
      const validationErrors = validateAdminSettings(settings);
      if (validationErrors.length > 0) {
        throw new Error(`Configurações inválidas: ${validationErrors.join(', ')}`);
      }

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

  async secureProfileCreate(profileData: any): Promise<any> {
    return this.secureRequest(async () => {
      // Sanitizar dados do perfil
      const sanitizedData = {
        id: profileData.id, // UUID não precisa sanitizar
        email: sanitizeInput(profileData.email || '', { maxLength: 320 }),
        full_name: sanitizeInput(profileData.full_name || '', { maxLength: 200 }),
        role: sanitizeInput(profileData.role || 'user', { maxLength: 50 })
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([sanitizedData])
        .select()
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error('Perfil não foi criado. Verifique as permissões.');
      }

      return data;
    }, 'CREATE_PROFILE');
  }
}

export const secureApiClient = SecureApiClient.getInstance();
