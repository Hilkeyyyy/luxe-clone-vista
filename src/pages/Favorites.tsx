
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  is_new: boolean;
  clone_category?: string;
}

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(favoriteIds);

    if (favoriteIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', favoriteIds)
        .eq('in_stock', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus favoritos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = (productId: string) => {
    const updatedFavorites = favorites.filter(id => id !== productId);
    setFavorites(updatedFavorites);
    setProducts(products.filter(p => p.id !== productId));
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Removido dos favoritos",
      description: "Produto removido da sua lista de favoritos.",
    });
  };

  const addAllToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    products.forEach(product => {
      const existingItemIndex = cartItems.findIndex((item: any) => item.product_id === product.id);
      
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push({
          id: Date.now().toString() + Math.random(),
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.images[0] || '',
          selected_color: '',
          selected_size: '',
          quantity: 1,
          brand: product.brand,
          clone_category: product.clone_category
        });
      }
    });

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Produtos adicionados!",
      description: `${products.length} produtos adicionados à sua lista de interesse.`,
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    setProducts([]);
    localStorage.setItem('favorites', JSON.stringify([]));
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Favoritos limpos",
      description: "Todos os favoritos foram removidos.",
    });
  };

  const formatProductsForCard = (products: Product[]) => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      originalPrice: product.original_price 
        ? `R$ ${product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
        : undefined,
      image: product.images[0] || `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop`,
      isNew: product.is_new
    }));
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
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <h1 className="text-3xl font-bold text-neutral-900">Meus Favoritos</h1>
          </div>
          
          {products.length > 0 && (
            <div className="flex space-x-3">
              <button
                onClick={addAllToCart}
                className="flex items-center space-x-2 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <ShoppingCart size={18} />
                <span>Adicionar Todos ao Carrinho</span>
              </button>
              <button
                onClick={clearAllFavorites}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
                <span>Limpar Favoritos</span>
              </button>
            </div>
          )}
        </motion.div>

        {products.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart size={64} className="mx-auto text-neutral-300 mb-4" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Nenhum produto favoritado
            </h2>
            <p className="text-neutral-600 mb-8">
              Adicione produtos aos favoritos para acessá-los rapidamente
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
            >
              Ver Produtos
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {formatProductsForCard(products).map((product, index) => (
              <ProductCard
                key={product.id}
                {...product}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;
