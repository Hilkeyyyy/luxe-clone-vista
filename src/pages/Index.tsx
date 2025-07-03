
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import FeaturedProductsGrid from '../components/FeaturedProductsGrid';
import BrandCategoryCarousel from '../components/BrandCategoryCarousel';
import Footer from '../components/Footer';
import { useProductsByType } from '../hooks/useProductsByType';

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      {/* Hero Section com carrossel vertical das marcas */}
      <HeroSection />
      
      {/* Carrossel NOVIDADES (horizontal) */}
      <ProductCarousel 
        title="NOVIDADES" 
        products={newProducts} 
        loading={loading}
      />
      
      {/* Carrossel OFERTAS (horizontal) */}
      <ProductCarousel 
        title="OFERTAS" 
        products={offerProducts} 
        loading={loading}
      />
      
      {/* Seção DESTAQUES (grid vertical, usuário rola a tela) */}
      <FeaturedProductsGrid 
        products={featuredProducts} 
        loading={loading}
      />
      
      {/* Carrossel das marcas (horizontal) */}
      <BrandCategoryCarousel />
      
      <Footer />
    </div>
  );
};

export default Index;
