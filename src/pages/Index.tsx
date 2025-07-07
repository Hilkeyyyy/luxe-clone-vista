
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
    console.log('🏠 INDEX: Estado atualizado', {
      novos: newProducts.length,
      destaques: featuredProducts.length,
      ofertas: offerProducts.length,
      carregando: loading,
      debug: debugInfo
    });
  }, [newProducts, featuredProducts, offerProducts, loading, debugInfo]);

  // Mostrar debug visual apenas se houver problema OU durante carregamento
  const showDebug = loading || (newProducts.length === 0 && featuredProducts.length === 0 && offerProducts.length === 0);

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      {/* DEBUG INFO MOBILE - Mais detalhado */}
      {showDebug && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-3 m-4 rounded">
          <div className="font-bold text-sm mb-2">🔧 DEBUG MOBILE:</div>
          <div className="text-sm mb-2">{debugInfo}</div>
          <div className="text-xs grid grid-cols-2 gap-2">
            <div>⏳ Carregando: <strong>{loading ? 'Sim' : 'Não'}</strong></div>
            <div>🆕 Novos: <strong>{newProducts.length}</strong></div>
            <div>⭐ Destaques: <strong>{featuredProducts.length}</strong></div>
            <div>🏷️ Ofertas: <strong>{offerProducts.length}</strong></div>
          </div>
          {!loading && newProducts.length === 0 && featuredProducts.length === 0 && offerProducts.length === 0 && (
            <div className="mt-2 text-xs text-red-600">
              ❌ Nenhum produto carregado - verificar logs do console
            </div>
          )}
        </div>
      )}
      
      <HeroSection />
      
      <ProductCarousel 
        title="NOVIDADES" 
        products={newProducts} 
        loading={loading}
      />
      
      <ProductCarousel 
        title="OFERTAS" 
        products={offerProducts} 
        loading={loading}
      />
      
      <FeaturedProductsGrid 
        products={featuredProducts} 
        loading={loading}
      />
      
      <BrandCategoryCarousel />
      
      <Footer />
    </div>
  );
};

export default Index;
