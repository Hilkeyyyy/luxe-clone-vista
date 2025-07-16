
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FavoriteProduct {
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
  category: string;
  description?: string;
  colors: string[];
  sizes: string[];
  specifications?: any;
  in_stock?: boolean;
  is_coming_soon?: boolean;
  diameter?: string;
  material?: string;
  movement?: string;
  water_resistance?: string;
}

export const useSecureFavorites = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cache para melhor performance
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_DURATION = 30000; // 30 segundos

  // Carregar produtos favoritos - OTIMIZADO COM CACHE
  const loadFavorites = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || !user) {
      console.log('❤️ Usuário não autenticado, limpando favoritos');
      setFavoriteProducts([]);
      setFavoriteIds(new Set());
      setInitialized(true);
      return;
    }

    // Verificar cache
    const now = Date.now();
    if (!forceRefresh && initialized && (now - lastFetch) < CACHE_DURATION) {
      console.log('❤️ Usando cache de favoritos');
      return;
    }

    try {
      setLoading(true);
      console.log('❤️ Carregando favoritos para usuário:', user.id);

      // Buscar favoritos com dados completos dos produtos
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
            clone_category,
            stock_status,
            is_sold_out,
            custom_badge,
            is_bestseller,
            is_featured,
            is_new,
            category,
            description,
            colors,
            sizes,
            specifications,
            in_stock,
            is_coming_soon,
            diameter,
            material,
            movement,
            water_resistance
          )
        `)
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('❌ Erro ao carregar favoritos:', favoritesError);
        throw favoritesError;
      }

      // Transformar dados para o formato esperado - COMPLETO
      const products: FavoriteProduct[] = (favoritesData || [])
        .filter(fav => fav.products) // Filtrar produtos que existem
        .map(fav => ({
          id: fav.product_id,
          name: fav.products?.name || 'Produto não encontrado',
          brand: fav.products?.brand || '',
          price: fav.products?.price || 0,
          original_price: fav.products?.original_price || undefined,
          images: fav.products?.images || [],
          clone_category: fav.products?.clone_category || 'Clone',
          stock_status: fav.products?.stock_status || 'in_stock',
          is_sold_out: fav.products?.is_sold_out || false,
          custom_badge: fav.products?.custom_badge || undefined,
          is_bestseller: fav.products?.is_bestseller || false,
          is_featured: fav.products?.is_featured || false,
          is_new: fav.products?.is_new || false,
          category: fav.products?.category || '',
          description: fav.products?.description || '',
          colors: fav.products?.colors || [],
          sizes: fav.products?.sizes || [],
          specifications: fav.products?.specifications || {},
          in_stock: fav.products?.in_stock ?? true,
          is_coming_soon: fav.products?.is_coming_soon || false,
          diameter: fav.products?.diameter || '',
          material: fav.products?.material || '',
          movement: fav.products?.movement || '',
          water_resistance: fav.products?.water_resistance || '',
        }));

      // Criar Set de IDs para verificação rápida
      const ids = new Set(products.map(p => p.id));

      console.log('✅ Favoritos carregados:', products.length);
      setFavoriteProducts(products);
      setFavoriteIds(ids);
      setLastFetch(now);
      
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
  }, [isAuthenticated, user, initialized, lastFetch]);

  // Verificar se produto está nos favoritos - OTIMIZADO
  const isFavorite = useCallback((productId: string): boolean => {
    return favoriteIds.has(productId);
  }, [favoriteIds]);

  // Adicionar/remover favorito - OTIMIZADO
  const toggleFavorite = useCallback(async (productId: string, productName: string) => {
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

        // Atualizar estado local IMEDIATAMENTE
        setFavoriteProducts(prev => prev.filter(fav => fav.id !== productId));
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });

        toast({
          title: "💔 Removido dos favoritos",
          description: productName,
          duration: 1500,
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

        // Atualizar IDs imediatamente
        setFavoriteIds(prev => new Set([...prev, productId]));

        // Recarregar favoritos para obter dados completos
        await loadFavorites(true);

        toast({
          title: "❤️ Adicionado aos favoritos",
          description: productName,
          duration: 1500,
        });
      }

      // Disparar evento para atualizar contadores
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));

    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      throw error;
    }
  }, [isAuthenticated, user, isFavorite, loadFavorites, toast]);

  // Inicializar quando usuário muda
  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated, user?.id]);

  // Listener para atualizações em tempo real
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const channel = supabase
      .channel('favorites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('❤️ Favoritos atualizados, recarregando...');
          loadFavorites(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user?.id, loadFavorites]);

  return {
    favoriteProducts,
    loading,
    initialized,
    isFavorite,
    toggleFavorite,
    refetch: () => loadFavorites(true),
  };
};
