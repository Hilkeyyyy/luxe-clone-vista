
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import FeaturedProductsGrid from '../components/FeaturedProductsGrid';
import BrandCategoryCarousel from '../components/BrandCategoryCarousel';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import SecurityWrapper from '../components/security/SecurityWrapper';
import { useProductsByType } from '../hooks/useProductsByType';

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();

  return (
    <SecurityWrapper>
      <ErrorBoundary>
        <div className="min-h-screen bg-white font-outfit">
          <Header />
          
          <HeroSection />
          
          <ErrorBoundary fallback={
            <div className="py-8 text-center">
              <p className="text-neutral-500">Erro ao carregar novidades</p>
            </div>
          }>
            <ProductCarousel 
              title="NOVIDADES" 
              products={newProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-8 text-center">
              <p className="text-neutral-500">Erro ao carregar ofertas</p>
            </div>
          }>
            <ProductCarousel 
              title="OFERTAS" 
              products={offerProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-8 text-center">
              <p className="text-neutral-500">Erro ao carregar produtos em destaque</p>
            </div>
          }>
            <FeaturedProductsGrid 
              products={featuredProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-8 text-center">
              <p className="text-neutral-500">Erro ao carregar categorias</p>
            </div>
          }>
            <BrandCategoryCarousel />
          </ErrorBoundary>
          
          <Footer />
        </div>
      </ErrorBoundary>
    </SecurityWrapper>
  );
};

export default Index;
