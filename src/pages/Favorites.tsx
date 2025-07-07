
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoritesHeader from '@/components/favorites/FavoritesHeader';
import FavoritesGrid from '@/components/favorites/FavoritesGrid';
import EmptyFavorites from '@/components/favorites/EmptyFavorites';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSecureFavorites } from '@/hooks/useSecureFavorites';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingBag } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

const Favorites = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { favoriteProducts, loading: favoritesLoading, initialized } = useSecureFavorites();

  // CORREÇÃO: Aguardar autenticação antes de mostrar conteúdo
  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <EmptyState
          icon={ShoppingBag}
          title="Faça login para ver seus favoritos"
          description="Entre na sua conta para acessar seus produtos favoritos."
          action={{
            label: "Fazer Login",
            onClick: () => window.location.href = '/login'
          }}
        />
        <Footer />
      </div>
    );
  }

  if (favoritesLoading) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FavoritesHeader count={favoriteProducts.length} />

        {favoriteProducts.length > 0 ? (
          <FavoritesGrid products={favoriteProducts} />
        ) : (
          <EmptyFavorites />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
