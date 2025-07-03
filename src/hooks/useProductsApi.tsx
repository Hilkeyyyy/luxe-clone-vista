
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateProductData, sanitizeProductData, rateLimiter } from '@/utils/security';

export const useProductsApi = () => {
  const { toast } = useToast();

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand_categories (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const createProduct = async (productData: any) => {
    // Rate limiting
    const userKey = `create_product_${Date.now()}`;
    if (rateLimiter.isRateLimited(userKey)) {
      throw new Error('Muitas tentativas. Aguarde um momento.');
    }

    // Validar e sanitizar dados
    const validatedData = validateProductData(productData);
    const sanitizedData = sanitizeProductData(validatedData);

    // Buscar ou criar categoria da marca
    let brandCategoryId = null;
    if (sanitizedData.brand) {
      const { data: categoryData, error: categoryError } = await supabase
        .rpc('get_or_create_brand_category', { 
          category_name: sanitizedData.brand 
        });

      if (categoryError) {
        console.error('Erro ao obter categoria:', categoryError);
      } else {
        brandCategoryId = categoryData;
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...sanitizedData,
        brand_category_id: brandCategoryId
      }])
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Sucesso",
      description: "Produto criado com sucesso.",
    });

    return data;
  };

  const updateProduct = async (id: string, productData: any) => {
    // Rate limiting
    const userKey = `update_product_${id}`;
    if (rateLimiter.isRateLimited(userKey)) {
      throw new Error('Muitas tentativas. Aguarde um momento.');
    }

    // Validar e sanitizar dados
    const validatedData = validateProductData(productData);
    const sanitizedData = sanitizeProductData(validatedData);

    // Buscar ou criar categoria da marca
    let brandCategoryId = null;
    if (sanitizedData.brand) {
      const { data: categoryData, error: categoryError } = await supabase
        .rpc('get_or_create_brand_category', { 
          category_name: sanitizedData.brand 
        });

      if (categoryError) {
        console.error('Erro ao obter categoria:', categoryError);
      } else {
        brandCategoryId = categoryData;
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...sanitizedData,
        brand_category_id: brandCategoryId,
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
  };

  const deleteProduct = async (id: string) => {
    // Rate limiting
    const userKey = `delete_product_${id}`;
    if (rateLimiter.isRateLimited(userKey)) {
      throw new Error('Muitas tentativas. Aguarde um momento.');
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast({
      title: "Sucesso",
      description: "Produto excluído com sucesso.",
    });
  };

  return {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
