
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
      console.log('🗑️ Iniciando exclusão TRANSACIONAL do produto ID:', id);

      try {
        // CORREÇÃO: Usar RPC para exclusão em transação atômica
        const { data, error } = await supabase.rpc('delete_product_with_dependencies', {
          product_id: id
        });

        if (error) {
          console.error('❌ Erro na exclusão transacional:', error);
          throw error;
        }

        console.log('✅ Produto excluído com sucesso via transação:', data);

        // Exibir mensagem de sucesso com detalhes
        const successData = data || {};
        let successMessage = "Produto excluído com sucesso.";
        
        if (successData.cart_items_deleted > 0 || successData.favorites_deleted > 0) {
          const details = [];
          if (successData.cart_items_deleted > 0) {
            details.push(`${successData.cart_items_deleted} item(s) removido(s) do carrinho`);
          }
          if (successData.favorites_deleted > 0) {
            details.push(`${successData.favorites_deleted} favorito(s) removido(s)`);
          }
          successMessage += ` Também foram: ${details.join(' e ')}.`;
        }

        toast({
          title: "Sucesso",
          description: successMessage,
        });

        return data;

      } catch (rpcError: any) {
        console.error('❌ RPC falhou, tentando método alternativo:', rpcError);
        
        // FALLBACK: Método manual com verificações robustas
        return await deleteProductManually(id);
      }
    }, 'DELETE_PRODUCT', id);
  };

  // Método manual como fallback
  const deleteProductManually = async (id: string) => {
    console.log('🔄 Executando exclusão manual para produto ID:', id);
    
    let cartItemsDeleted = 0;
    let favoritesDeleted = 0;

    try {
      // ETAPA 1: Verificar e remover itens do carrinho com retry
      console.log('🛒 Verificando itens do carrinho...');
      let cartAttempts = 0;
      const maxAttempts = 3;
      
      while (cartAttempts < maxAttempts) {
        const { data: cartItems, error: cartCheckError } = await supabase
          .from('cart_items')
          .select('id')
          .eq('product_id', id);

        if (cartCheckError) {
          console.error('❌ Erro ao verificar carrinho:', cartCheckError);
          throw cartCheckError;
        }

        if (!cartItems || cartItems.length === 0) {
          console.log('✅ Nenhum item no carrinho para remover');
          break;
        }

        console.log(`🛒 Removendo ${cartItems.length} itens do carrinho (tentativa ${cartAttempts + 1})`);
        
        const { error: deleteCartError } = await supabase
          .from('cart_items')
          .delete()
          .eq('product_id', id);

        if (deleteCartError) {
          cartAttempts++;
          if (cartAttempts >= maxAttempts) {
            console.error('❌ Erro crítico ao remover itens do carrinho:', deleteCartError);
            throw new Error(`Erro ao limpar carrinho após ${maxAttempts} tentativas: ${deleteCartError.message}`);
          }
          console.warn(`⚠️ Tentativa ${cartAttempts} falhou, tentando novamente...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo
          continue;
        }

        cartItemsDeleted = cartItems.length;
        console.log(`✅ ${cartItemsDeleted} itens removidos do carrinho`);
        break;
      }

      // ETAPA 2: Verificar e remover favoritos com retry
      console.log('❤️ Verificando favoritos...');
      let favAttempts = 0;
      
      while (favAttempts < maxAttempts) {
        const { data: favoriteItems, error: favCheckError } = await supabase
          .from('favorites')
          .select('id')
          .eq('product_id', id);

        if (favCheckError) {
          console.error('❌ Erro ao verificar favoritos:', favCheckError);
          throw favCheckError;
        }

        if (!favoriteItems || favoriteItems.length === 0) {
          console.log('✅ Nenhum favorito para remover');
          break;
        }

        console.log(`❤️ Removendo ${favoriteItems.length} favoritos (tentativa ${favAttempts + 1})`);
        
        const { error: deleteFavError } = await supabase
          .from('favorites')
          .delete()
          .eq('product_id', id);

        if (deleteFavError) {
          favAttempts++;
          if (favAttempts >= maxAttempts) {
            console.error('❌ Erro crítico ao remover favoritos:', deleteFavError);
            throw new Error(`Erro ao limpar favoritos após ${maxAttempts} tentativas: ${deleteFavError.message}`);
          }
          console.warn(`⚠️ Tentativa ${favAttempts} falhou, tentando novamente...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo
          continue;
        }

        favoritesDeleted = favoriteItems.length;
        console.log(`✅ ${favoritesDeleted} favoritos removidos`);
        break;
      }

      // ETAPA 3: Verificação final antes da exclusão
      console.log('🔍 Verificação final antes da exclusão...');
      const { data: finalCartCheck } = await supabase
        .from('cart_items')
        .select('id')
        .eq('product_id', id);
        
      const { data: finalFavCheck } = await supabase
        .from('favorites')
        .select('id')
        .eq('product_id', id);

      if ((finalCartCheck && finalCartCheck.length > 0) || (finalFavCheck && finalFavCheck.length > 0)) {
        throw new Error('Ainda existem referências ao produto após limpeza. Operação cancelada por segurança.');
      }

      // ETAPA 4: Excluir o produto
      console.log('🗑️ Excluindo produto após limpeza completa...');
      const { error: deleteProductError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteProductError) {
        console.error('❌ Erro ao excluir produto após limpeza:', deleteProductError);
        throw deleteProductError;
      }

      console.log('✅ Produto excluído com sucesso após limpeza manual');

      // Mensagem de sucesso
      let successMessage = "Produto excluído com sucesso.";
      if (cartItemsDeleted > 0 || favoritesDeleted > 0) {
        const details = [];
        if (cartItemsDeleted > 0) details.push(`${cartItemsDeleted} item(s) removido(s) do carrinho`);
        if (favoritesDeleted > 0) details.push(`${favoritesDeleted} favorito(s) removido(s)`);
        successMessage += ` Também foram: ${details.join(' e ')}.`;
      }

      toast({
        title: "Sucesso",
        description: successMessage,
      });

      return {
        success: true,
        cart_items_deleted: cartItemsDeleted,
        favorites_deleted: favoritesDeleted
      };

    } catch (error: any) {
      console.error('❌ Erro na exclusão manual:', error);
      throw error;
    }
  };

  return {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
