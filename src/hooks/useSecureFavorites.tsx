
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FavoriteProduct {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  customBadge?: string;
}

export const useSecureFavorites = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Carregar produtos favoritos
  const loadFavorites = async () => {
    if (!isAuthenticated || !user) {
      console.log('❤️ Usuário não autenticado, limpando favoritos');
      setFavoriteProducts([]);
      setInitialized(true);
      return;
    }

    try {
      setLoading(true);
      console.log('❤️ Carregando favoritos para usuário:', user.id);

      // Buscar favoritos com dados dos produtos
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          products (
            id,
            name,
            brand,
            price,
            original_price,
            images,
            category,
            is_new,
            is_featured,
            custom_badge
          )
        `)
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('❌ Erro ao carregar favoritos:', favoritesError);
        throw favoritesError;
      }

      // Transformar dados para o formato esperado
      const products: FavoriteProduct[] = (favoritesData || []).map(fav => ({
        id: fav.id,
        productId: fav.product_id,
        name: fav.products?.name || 'Produto não encontrado',
        brand: fav.products?.brand || '',
        price: fav.products?.price || 0,
        originalPrice: fav.products?.original_price || undefined,
        image: fav.products?.images?.[0] || '',
        category: fav.products?.category || '',
        isNew: fav.products?.is_new || false,
        isFeatured: fav.products?.is_featured || false,
        customBadge: fav.products?.custom_badge || undefined,
      }));

      console.log('✅ Favoritos carregados:', products.length);
      setFavoriteProducts(products);
      
      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar favoritos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Verificar se produto está nos favoritos
  const isFavorite = (productId: string): boolean => {
    return favoriteProducts.some(fav => fav.productId === productId);
  };

  // Adicionar/remover favorito
  const toggleFavorite = async (productId: string, productName: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const isCurrentlyFavorite = isFavorite(productId);

      if (isCurrentlyFavorite) {
        // Remover favorito
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        // Atualizar estado local
        setFavoriteProducts(prev => prev.filter(fav => fav.productId !== productId));

        toast({
          title: "💔 Removido dos favoritos",
          description: productName,
        });
      } else {
        // Adicionar favorito
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: productId,
          });

        if (error) throw error;

        // Recarregar favoritos para obter dados completos
        await loadFavorites();

        toast({
          title: "❤️ Adicionado aos favoritos",
          description: productName,
        });
      }

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));

    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      throw error;
    }
  };

  // Inicializar quando usuário muda
  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated, user]);

  return {
    favoriteProducts,
    loading,
    initialized,
    isFavorite,
    toggleFavorite,
    refetch: loadFavorites,
  };
};
