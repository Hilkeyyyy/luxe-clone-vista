
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  clone_category: string;
  stock_status: string;
  is_sold_out: boolean;
  custom_badge?: string;
  is_bestseller: boolean;
  is_featured: boolean;
  is_new: boolean;
}

export const useSecureFavorites = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const loadFavorites = async () => {
    // CORREÇÃO: Aguardar autenticação completa antes de carregar
    if (authLoading) {
      console.log('🔄 Aguardando autenticação completar...');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('🔒 Usuário não autenticado');
      setFavoriteProducts([]);
      setFavoriteIds([]);
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      console.log('❤️ Carregando favoritos do usuário:', user.id.substring(0, 8));
      
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('❌ Erro ao buscar favoritos:', favoritesError);
        throw favoritesError;
      }

      const productIds = favoritesData?.map(f => f.product_id) || [];
      setFavoriteIds(productIds);
      
      if (productIds.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        setInitialized(true);
        return;
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productsError) {
        console.error('❌ Erro ao buscar produtos favoritos:', productsError);
        throw productsError;
      }

      console.log(`✅ ${productsData?.length || 0} favoritos carregados`);
      setFavoriteProducts(productsData || []);
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar seus produtos favoritos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const toggleFavorite = async (productId: string, productName: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar favoritos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isFavorite = favoriteIds.includes(productId);
      
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setFavoriteIds(prev => prev.filter(id => id !== productId));
        setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
        
        toast({
          title: "❤️ Removido dos favoritos",
          description: `${productName} foi removido dos seus favoritos.`,
          duration: 3000,
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;

        setFavoriteIds(prev => [...prev, productId]);
        
        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productData) {
          setFavoriteProducts(prev => [...prev, productData]);
        }
        
        toast({
          title: "❤️ Adicionado aos favoritos",
          description: `${productName} foi adicionado aos seus favoritos.`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao alterar favorito:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar favorito.",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  // CORREÇÃO: Aguardar autenticação antes de carregar favoritos
  useEffect(() => {
    if (!authLoading) {
      loadFavorites();
    }
  }, [isAuthenticated, user?.id, authLoading]);

  return {
    favoriteProducts,
    favoriteIds,
    loading: loading || authLoading,
    initialized,
    toggleFavorite,
    isFavorite,
    refetch: loadFavorites,
  };
};
