
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateProductData, sanitizeProductData, rateLimiter } from '@/utils/security';

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
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
      setProducts(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    try {
      // Rate limiting
      const userKey = `create_product_${Date.now()}`;
      if (rateLimiter.isRateLimited(userKey)) {
        throw new Error('Muitas tentativas. Aguarde um momento.');
      }

      // Validar dados
      const validatedData = validateProductData(productData);
      
      // Sanitizar dados
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

      setProducts(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso.",
      });

      return data;
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar produto.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    try {
      // Rate limiting
      const userKey = `update_product_${id}`;
      if (rateLimiter.isRateLimited(userKey)) {
        throw new Error('Muitas tentativas. Aguarde um momento.');
      }

      // Validar dados
      const validatedData = validateProductData(productData);
      
      // Sanitizar dados
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

      setProducts(prev => prev.map(p => p.id === id ? data : p));
      
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso.",
      });

      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar produto.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
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

      setProducts(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir produto.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
