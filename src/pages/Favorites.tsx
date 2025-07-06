
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoritesHeader from '@/components/favorites/FavoritesHeader';
import FavoritesGrid from '@/components/favorites/FavoritesGrid';
import EmptyFavorites from '@/components/favorites/EmptyFavorites';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useFavorites } from '@/hooks/useFavorites';

const Favorites = () => {
  const { favoriteProducts, loading } = useFavorites();

  if (loading) {
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
