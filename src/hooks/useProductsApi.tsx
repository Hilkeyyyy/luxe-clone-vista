
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
      console.error('❌ Erro completo ao criar produto:', error);
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

      console.log('🔄 Atualizando produto ID:', id, 'com dados:', sanitizedData);

      const { data, error } = await supabase
        .from('products')
        .update({
          ...sanitizedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao atualizar produto:', error);
        throw error;
      }

      if (!data) {
        console.error('❌ Nenhum dado retornado após atualização para ID:', id);
        throw new Error('Produto não foi atualizado. Verifique se o produto existe e se você tem permissões.');
      }

      console.log('✅ Produto atualizado com sucesso:', data);

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso.",
      });

      return data;
    }, 'UPDATE_PRODUCT', id);
  };

  const deleteProduct = async (id: string) => {
    return secureApiClient.secureRequest(async () => {
      console.log('🗑️ Iniciando exclusão do produto ID:', id);

      try {
        // ETAPA 1: Verificar quantos registros relacionados existem
        const { data: cartItems, error: cartError } = await supabase
          .from('cart_items')
          .select('id, user_id')
          .eq('product_id', id);

        if (cartError) {
          console.error('❌ Erro ao verificar itens do carrinho:', cartError);
          throw new Error('Erro ao verificar dependências do produto.');
        }

        const { data: favoriteItems, error: favError } = await supabase
          .from('favorites')
          .select('id, user_id')
          .eq('product_id', id);

        if (favError) {
          console.error('❌ Erro ao verificar favoritos:', favError);
          throw new Error('Erro ao verificar dependências do produto.');
        }

        const cartCount = cartItems?.length || 0;
        const favoritesCount = favoriteItems?.length || 0;

        console.log(`📊 Produto tem ${cartCount} itens no carrinho e ${favoritesCount} favoritos`);

        // ETAPA 2: Remover todas as referências do produto
        if (cartCount > 0) {
          console.log('🛒 Removendo itens do carrinho...');
          const { error: deleteCartError } = await supabase
            .from('cart_items')
            .delete()
            .eq('product_id', id);

          if (deleteCartError) {
            console.error('❌ Erro ao remover itens do carrinho:', deleteCartError);
            throw new Error('Erro ao limpar carrinho de compras.');
          }
          console.log('✅ Itens do carrinho removidos com sucesso');
        }

        if (favoritesCount > 0) {
          console.log('❤️ Removendo favoritos...');
          const { error: deleteFavError } = await supabase
            .from('favorites')
            .delete()
            .eq('product_id', id);

          if (deleteFavError) {
            console.error('❌ Erro ao remover favoritos:', deleteFavError);
            throw new Error('Erro ao limpar favoritos.');
          }
          console.log('✅ Favoritos removidos com sucesso');
        }

        // ETAPA 3: Excluir o produto
        console.log('🗑️ Excluindo produto...');
        const { error: deleteProductError } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (deleteProductError) {
          console.error('❌ Erro ao excluir produto:', deleteProductError);
          throw deleteProductError;
        }

        console.log('✅ Produto excluído com sucesso');

        // Mensagem de sucesso detalhada
        let successMessage = "Produto excluído com sucesso.";
        if (cartCount > 0 || favoritesCount > 0) {
          const details = [];
          if (cartCount > 0) details.push(`${cartCount} item(s) removido(s) do carrinho`);
          if (favoritesCount > 0) details.push(`${favoritesCount} favorito(s) removido(s)`);
          successMessage += ` Também foram: ${details.join(' e ')}.`;
        }

        toast({
          title: "Sucesso",
          description: successMessage,
        });

      } catch (error: any) {
        console.error('❌ Erro durante exclusão completa:', error);
        throw error;
      }
    }, 'DELETE_PRODUCT', id);
  };

  return {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
