
import React, { useMemo } from 'react';
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

  // Memoizar componentes pesados para evitar re-renders desnecessários
  const memoizedHeroSection = useMemo(() => <HeroSection />, []);
  const memoizedBrandCarousel = useMemo(() => <BrandCategoryCarousel />, []);

  return (
    <SecurityWrapper>
      <ErrorBoundary>
        <div className="min-h-screen bg-white font-outfit">
          <Header />
          
          {memoizedHeroSection}
          
          {/* CORREÇÃO 8: Mover carrossel de categorias para o topo (antes de NOVIDADES) */}
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar categorias</p>
            </div>
          }>
            {memoizedBrandCarousel}
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar novidades</p>
            </div>
          }>
            <ProductCarousel 
              title="NOVIDADES" 
              products={newProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar ofertas</p>
            </div>
          }>
            <ProductCarousel 
              title="OFERTAS" 
              products={offerProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar produtos em destaque</p>
            </div>
          }>
            <FeaturedProductsGrid 
              products={featuredProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          <Footer />
        </div>
      </ErrorBoundary>
    </SecurityWrapper>
  );
};

export default Index;
