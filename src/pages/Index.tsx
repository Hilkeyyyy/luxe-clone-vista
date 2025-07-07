
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import FeaturedProductsGrid from '../components/FeaturedProductsGrid';
import BrandCategoryCarousel from '../components/BrandCategoryCarousel';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import { useProductsByType } from '../hooks/useProductsByType';

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        
        <HeroSection />
        
        <ErrorBoundary fallback={<div className="h-64 flex items-center justify-center text-neutral-500">Erro ao carregar novidades</div>}>
          <ProductCarousel 
            title="NOVIDADES" 
            products={newProducts} 
            loading={loading}
          />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div className="h-64 flex items-center justify-center text-neutral-500">Erro ao carregar ofertas</div>}>
          <ProductCarousel 
            title="OFERTAS" 
            products={offerProducts} 
            loading={loading}
          />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div className="h-64 flex items-center justify-center text-neutral-500">Erro ao carregar produtos em destaque</div>}>
          <FeaturedProductsGrid 
            products={featuredProducts} 
            loading={loading}
          />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div className="h-64 flex items-center justify-center text-neutral-500">Erro ao carregar categorias</div>}>
          <BrandCategoryCarousel />
        </ErrorBoundary>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
