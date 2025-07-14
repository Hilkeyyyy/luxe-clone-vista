
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  
  // Flags para prevenir loops infinitos
  const mounted = useRef(true);
  const processing = useRef(false);

  const loadFavorites = useCallback(async () => {
    if (authLoading || processing.current || !mounted.current) {
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('❤️ Usuário não autenticado, limpando favoritos');
      setFavoriteProducts([]);
      setFavoriteIds([]);
      setLoading(false);
      setInitialized(true);
      return;
    }

    processing.current = true;
    console.log('❤️ Carregando favoritos para usuário:', user.id);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn('⏰ Timeout ao carregar favoritos');
      }, 5000);

      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (!mounted.current) return;

      if (favoritesError) {
        console.error('❌ Erro ao carregar favoritos:', favoritesError);
        throw favoritesError;
      }

      const productIds = favoritesData?.map(f => f.product_id) || [];
      console.log('❤️ IDs dos favoritos:', productIds.length);
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
        .in('id', productIds)
        .abortSignal(controller.signal);

      if (!mounted.current) return;

      if (productsError) {
        console.error('❌ Erro ao carregar produtos favoritos:', productsError);
        throw productsError;
      }

      console.log('✅ Produtos favoritos carregados:', productsData?.length || 0);
      setFavoriteProducts(productsData || []);

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      
    } catch (error: any) {
      if (error.name !== 'AbortError' && mounted.current) {
        console.error('❌ Erro ao carregar favoritos:', error);
        setFavoriteProducts([]);
        setFavoriteIds([]);
        toast({
          title: "Erro",
          description: "Erro ao carregar favoritos.",
          variant: "destructive",
        });
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
        setInitialized(true);
      }
      processing.current = false;
    }
  }, [user, isAuthenticated, authLoading, toast]);

  const toggleFavorite = useCallback(async (productId: string, productName: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar favoritos.",
        variant: "destructive",
      });
      return;
    }

    console.log('❤️ Alternando favorito:', { productId, productName });

    try {
      const isFavorite = favoriteIds.includes(productId);
      
      if (isFavorite) {
        console.log('💔 Removendo dos favoritos');
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setFavoriteIds(prev => prev.filter(id => id !== productId));
        setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
        
        toast({
          title: "💔 Removido dos favoritos",
          description: `${productName} foi removido dos seus favoritos.`,
          duration: 2000,
        });
      } else {
        console.log('❤️ Adicionando aos favoritos');
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;

        setFavoriteIds(prev => [...prev, productId]);
        
        // Buscar dados do produto
        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productData && mounted.current) {
          setFavoriteProducts(prev => [...prev, productData]);
        }
        
        toast({
          title: "❤️ Adicionado aos favoritos",
          description: `${productName} foi adicionado aos seus favoritos.`,
          duration: 2000,
        });
      }

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      
    } catch (error) {
      console.error('❌ Erro ao alterar favorito:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar favorito.",
        variant: "destructive",
      });
    }
  }, [favoriteIds, user, isAuthenticated, toast]);

  const isFavorite = useMemo(() => 
    (productId: string) => favoriteIds.includes(productId), 
    [favoriteIds]
  );

  useEffect(() => {
    mounted.current = true;
    
    // Só carregar quando auth estiver pronto e não inicializado ainda
    if (!authLoading && !initialized && !processing.current) {
      loadFavorites();
    }

    return () => {
      mounted.current = false;
    };
  }, [loadFavorites, authLoading, initialized]);

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
