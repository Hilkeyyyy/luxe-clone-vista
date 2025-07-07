
import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import FeaturedProductsGrid from '../components/FeaturedProductsGrid';
import BrandCategoryCarousel from '../components/BrandCategoryCarousel';
import Footer from '../components/Footer';
import ProductionDebugPanel from '../components/ProductionDebugPanel';
import { useProductsByType } from '../hooks/useProductsByType';

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading, debugInfo, refetch } = useProductsByType();

  // Auto-reload em caso de erro crítico (apenas uma vez)
  useEffect(() => {
    if (debugInfo.includes('💥') && !debugInfo.includes('🆘')) {
      console.log('🔄 AUTO-RELOAD devido a erro crítico');
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [debugInfo]);

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
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
      
      {/* Debug panel para produção */}
      <ProductionDebugPanel
        debugInfo={debugInfo}
        onRefetch={refetch}
        productCounts={{
          new: newProducts.length,
          featured: featuredProducts.length,
          offers: offerProducts.length
        }}
      />
    </div>
  );
};

export default Index;
