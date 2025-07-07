
import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import FeaturedProductsGrid from '../components/FeaturedProductsGrid';
import BrandCategoryCarousel from '../components/BrandCategoryCarousel';
import Footer from '../components/Footer';
import { useProductsByType } from '../hooks/useProductsByType';

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();

  useEffect(() => {
    console.log('🏠 =================================');
    console.log('🏠 INDEX: Componente montado');
    console.log('🏠 =================================');
    
    // Log dos produtos recebidos
    console.log('📦 INDEX: Produtos recebidos do hook:', {
      newProducts: newProducts.length,
      featuredProducts: featuredProducts.length,
      offerProducts: offerProducts.length,
      loading
    });

    console.log('📦 INDEX: Detalhes dos produtos:');
    console.log('🆕 Novos:', newProducts);
    console.log('⭐ Destaques:', featuredProducts);
    console.log('💰 Ofertas:', offerProducts);

  }, [newProducts, featuredProducts, offerProducts, loading]);

  console.log('🏠 INDEX: Renderizando com:', {
    newCount: newProducts.length,
    featuredCount: featuredProducts.length,
    offerCount: offerProducts.length,
    loading
  });

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
