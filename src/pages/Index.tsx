
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  is_new: boolean;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatProductsForCarousel = (products: Product[]) => {
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
      <div className="min-h-screen bg-white font-outfit flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  const newProducts = products.filter(p => p.is_new).slice(0, 6);
  const discountedProducts = products.filter(p => p.original_price && p.original_price > p.price).slice(0, 6);
  
  // If we don't have enough new or discounted products, use general products
  const topCarouselProducts = newProducts.length >= 3 ? newProducts : products.slice(0, 6);
  const bottomCarouselProducts = discountedProducts.length >= 3 ? discountedProducts : products.slice(6, 12);

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      {/* Top Carousel */}
      <ProductCarousel 
        title="Novidades" 
        products={formatProductsForCarousel(topCarouselProducts)} 
      />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Bottom Carousel */}
      <ProductCarousel 
        title="Mais Vendidos" 
        products={formatProductsForCarousel(bottomCarouselProducts)} 
      />
      
      <Footer />
    </div>
  );
};

export default Index;
