
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const Favorites = () => {
  const { toast } = useToast();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', favorites);

      if (error) throw error;
      setFavoriteProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar seus produtos favoritos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        {/* Page Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-red-600 mr-3" fill="currentColor" />
            <h1 className="text-4xl font-bold text-neutral-900">Meus Favoritos</h1>
          </div>
          <p className="text-neutral-600 text-lg">
            {favoriteProducts.length > 0 
              ? `${favoriteProducts.length} produto${favoriteProducts.length !== 1 ? 's' : ''} favorito${favoriteProducts.length !== 1 ? 's' : ''}`
              : 'Você ainda não tem produtos favoritos'
            }
          </p>
        </motion.div>

        {favoriteProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {favoriteProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                originalPrice={product.original_price ? `R$ ${product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : undefined}
                image={product.images[0]}
                clone_category={product.clone_category}
                stock_status={product.stock_status}
                is_sold_out={product.is_sold_out}
                custom_badge={product.custom_badge}
                is_bestseller={product.is_bestseller}
                is_featured={product.is_featured}
                isNew={product.is_new}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="max-w-md mx-auto">
              <Heart className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Nenhum produto favorito
              </h2>
              <p className="text-neutral-600 mb-8">
                Explore nossa coleção e adicione produtos aos seus favoritos clicando no ícone de coração.
              </p>
              <Link
                to="/produtos"
                className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explorar Produtos
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
