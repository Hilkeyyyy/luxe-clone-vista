
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { secureApiClient } from '@/utils/secureApiClient';
import { sanitizeInput } from '@/utils/securityEnhancements';

export const useProductsApi = () => {
  const { toast } = useToast();

  const fetchProducts = async () => {
    return secureApiClient.secureRequest(async () => {
      // CORREÇÃO: Query simples sem JOIN problemático
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'FETCH_PRODUCTS');
  };

  const createProduct = async (productData: any) => {
    try {
      const data = await secureApiClient.secureProductCreate(productData);
      
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar produto.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    return secureApiClient.secureRequest(async () => {
      // Sanitize data
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

      // CORREÇÃO: Remover lógica de brand_category até ser configurada corretamente
      const { data, error } = await supabase
        .from('products')
        .update({
          ...sanitizedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso.",
      });

      return data;
    }, 'UPDATE_PRODUCT', id);
  };

  const deleteProduct = async (id: string) => {
    return secureApiClient.secureRequest(async () => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso.",
      });
    }, 'DELETE_PRODUCT', id);
  };

  return {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
