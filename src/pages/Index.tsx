
import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import FeaturedProductsGrid from '../components/FeaturedProductsGrid';
import BrandCategoryCarousel from '../components/BrandCategoryCarousel';
import Footer from '../components/Footer';
import { useProductsByType } from '../hooks/useProductsByType';

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading, debugInfo } = useProductsByType();

  useEffect(() => {
    console.log('🏠 INDEX MOBILE: Página carregada');
    console.log('🏠 Produtos recebidos:', {
      novos: newProducts.length,
      destaques: featuredProducts.length,
      ofertas: offerProducts.length,
      loading,
      debug: debugInfo
    });
  }, [newProducts, featuredProducts, offerProducts, loading, debugInfo]);

  // DEBUG VISUAL MOBILE - Mostrar info na tela
  const showDebug = loading || (newProducts.length === 0 && featuredProducts.length === 0 && offerProducts.length === 0);

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      {/* DEBUG INFO MOBILE - Só mostra se houver problema */}
      {showDebug && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 m-4 rounded">
          <strong>DEBUG MOBILE:</strong> {debugInfo}
          <br />
          <small>
            Carregando: {loading ? 'Sim' : 'Não'} | 
            Novos: {newProducts.length} | 
            Destaques: {featuredProducts.length} | 
            Ofertas: {offerProducts.length}
          </small>
        </div>
      )}
      
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
