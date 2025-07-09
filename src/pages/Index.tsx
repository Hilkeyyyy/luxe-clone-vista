
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

  // OTIMIZAÇÃO: Memoizar componentes para evitar re-renders desnecessários
  const memoizedHeroSection = useMemo(() => <HeroSection />, []);
  const memoizedBrandCarousel = useMemo(() => <BrandCategoryCarousel />, []);

  // OTIMIZAÇÃO: Memoizar produtos quando carregados
  const memoizedNewProducts = useMemo(() => newProducts, [newProducts]);
  const memoizedFeaturedProducts = useMemo(() => featuredProducts, [featuredProducts]);
  const memoizedOfferProducts = useMemo(() => offerProducts, [offerProducts]);

  return (
    <SecurityWrapper>
      <ErrorBoundary>
        <div className="min-h-screen bg-white font-outfit">
          <Header />
          
          {memoizedHeroSection}
          
          {/* CARROSSEL DE CATEGORIAS NO TOPO - Acima de NOVIDADES */}
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar categorias</p>
            </div>
          }>
            {memoizedBrandCarousel}
          </ErrorBoundary>
          
          {/* NOVIDADES */}
          <ErrorBoundary fallback={
            <div className="py-4 sm:py-8 text-center">
              <p className="text-neutral-500 text-sm sm:text-base">Erro ao carregar novidades</p>
            </div>
          }>
            <ProductCarousel 
              title="NOVIDADES" 
              products={memoizedNewProducts} 
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
              products={memoizedOfferProducts} 
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
              products={memoizedFeaturedProducts} 
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
