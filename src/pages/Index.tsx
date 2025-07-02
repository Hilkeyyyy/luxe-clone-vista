
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import CategoryFilter from '../components/CategoryFilter';
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
  clone_category?: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, brand, price, original_price, images, is_new, clone_category')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const productsData = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        original_price: product.original_price || undefined,
        images: product.images,
        is_new: product.is_new || false,
        clone_category: product.clone_category || undefined
      }));
      
      setProducts(productsData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(productsData
        .map(p => p.clone_category)
        .filter(Boolean))] as string[];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!selectedCategory) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.clone_category === selectedCategory));
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

  const newProducts = filteredProducts.filter(p => p.is_new).slice(0, 8);
  const discountedProducts = filteredProducts.filter(p => p.original_price && p.original_price > p.price).slice(0, 8);
  
  // If we don't have enough new or discounted products, use general products
  const topCarouselProducts = newProducts.length >= 3 ? newProducts : filteredProducts.slice(0, 8);
  const bottomCarouselProducts = discountedProducts.length >= 3 ? discountedProducts : filteredProducts.slice(8, 16);

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      )}
      
      {/* Top Carousel */}
      <ProductCarousel 
        title={selectedCategory ? `${selectedCategory} - Novidades` : "Novidades"} 
        products={formatProductsForCarousel(topCarouselProducts)} 
      />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Bottom Carousel */}
      <ProductCarousel 
        title={selectedCategory ? `${selectedCategory} - Mais Vendidos` : "Mais Vendidos"} 
        products={formatProductsForCarousel(bottomCarouselProducts)} 
      />
      
      <Footer />
    </div>
  );
};

export default Index;
