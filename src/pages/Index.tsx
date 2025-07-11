
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

// Memoizar componentes estáticos
const MemoizedHeroSection = React.memo(HeroSection);
const MemoizedBrandCarousel = React.memo(BrandCategoryCarousel);
const MemoizedHeader = React.memo(Header);
const MemoizedFooter = React.memo(Footer);

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();

  // Memoizar produtos quando carregados
  const memoizedProducts = useMemo(() => ({
    newProducts,
    featuredProducts,
    offerProducts
  }), [newProducts, featuredProducts, offerProducts]);

  return (
    <SecurityWrapper>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 font-outfit">
          <MemoizedHeader />
          
          <MemoizedHeroSection />
          
          {/* CARROSSEL DE CATEGORIAS NO TOPO */}
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar categorias</p>
            </div>
          }>
            <MemoizedBrandCarousel />
          </ErrorBoundary>
          
          {/* NOVIDADES */}
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar novidades</p>
            </div>
          }>
            <ProductCarousel 
              title="NOVIDADES" 
              products={memoizedProducts.newProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          {/* OFERTAS */}
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar ofertas</p>
            </div>
          }>
            <ProductCarousel 
              title="OFERTAS" 
              products={memoizedProducts.offerProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          {/* DESTAQUES */}
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar produtos em destaque</p>
            </div>
          }>
            <FeaturedProductsGrid 
              products={memoizedProducts.featuredProducts} 
              loading={loading}
            />
          </ErrorBoundary>
          
          <MemoizedFooter />
        </div>
      </ErrorBoundary>
    </SecurityWrapper>
  );
};

export default Index;
