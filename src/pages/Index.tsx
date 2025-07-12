
import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CarouselSkeleton from '@/components/ui/CarouselSkeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProductsByType } from '@/hooks/useProductsByType';

// Lazy loading dos componentes pesados
const BrandCategoryCarousel = lazy(() => import('@/components/BrandCategoryCarousel'));
const ProductCarousel = lazy(() => import('@/components/ProductCarousel'));
const FeaturedProductsGrid = lazy(() => import('@/components/FeaturedProductsGrid'));
const VerticalBrandCarousel = lazy(() => import('@/components/VerticalBrandCarousel'));

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();

  return (
    <div className="min-h-screen font-outfit" style={{
      background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.95) 0%, rgba(243, 244, 246, 0.9) 50%, rgba(249, 250, 251, 0.95) 100%)',
    }}>
      <Header />
      
      {/* Hero Section com Glassmorphism */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSection />
      </motion.div>

      {/* Brand Categories com Glassmorphism */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
              Explore Nossas Categorias
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
              Descubra nossa seleção curada de relógios premium das melhores marcas do mundo
            </p>
          </motion.div>
          
          <Suspense fallback={<CarouselSkeleton />}>
            <BrandCategoryCarousel />
          </Suspense>
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(249, 250, 251, 0.6) 100%)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
              Produtos em Destaque
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
              Os relógios mais procurados e admirados da nossa coleção
            </p>
          </motion.div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProductsGrid products={featuredProducts} loading={loading} />
          </Suspense>
        </div>
      </motion.section>

      {/* New Arrivals */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
              Novidades
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
              Os lançamentos mais recentes que acabaram de chegar
            </p>
          </motion.div>
          
          <Suspense fallback={<CarouselSkeleton />}>
            <ProductCarousel 
              title="Novos Lançamentos"
              products={newProducts}
              loading={loading}
            />
          </Suspense>
        </div>
      </motion.section>

      {/* Bestsellers */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(249, 250, 251, 0.6) 100%)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
              Mais Vendidos
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
              Os relógios preferidos dos nossos clientes
            </p>
          </motion.div>
          
          <Suspense fallback={<CarouselSkeleton />}>
            <ProductCarousel 
              title="Best Sellers"
              products={offerProducts}
              loading={loading}
            />
          </Suspense>
        </div>
      </motion.section>

      {/* Vertical Brand Carousel */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
              Marcas Premium
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
              Explore nossa seleção exclusiva das melhores marcas
            </p>
          </motion.div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <VerticalBrandCarousel />
          </Suspense>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Index;
