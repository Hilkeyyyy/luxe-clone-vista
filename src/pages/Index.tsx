
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
    <div className="min-h-screen font-outfit bg-neutral-50">
      <Header />
      
      {/* Hero Section Premium */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSection />
      </motion.div>

      {/* Brand Categories - Restaurado */}
      <motion.section 
        className="py-8 sm:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Suspense fallback={<CarouselSkeleton />}>
          <BrandCategoryCarousel />
        </Suspense>
      </motion.section>

      {/* Featured Products */}
      <motion.section 
        className="py-8 sm:py-12 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-outfit font-light text-neutral-900 mb-2 tracking-wide">
              PRODUTOS EM DESTAQUE
            </h2>
            <p className="text-neutral-600 text-sm max-w-2xl mx-auto font-light">
              Os relógios mais procurados e admirados da nossa coleção
            </p>
          </motion.div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProductsGrid products={featuredProducts} loading={loading} />
          </Suspense>
        </div>
      </motion.section>

      {/* New Arrivals - Hierarquia Corrigida */}
      <motion.section 
        className="py-8 sm:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Suspense fallback={<CarouselSkeleton />}>
          <ProductCarousel 
            title="NOVIDADES"
            products={newProducts}
            loading={loading}
          />
        </Suspense>
      </motion.section>

      {/* Offers - Hierarquia Corrigida */}
      <motion.section 
        className="py-8 sm:py-12 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Suspense fallback={<CarouselSkeleton />}>
          <ProductCarousel 
            title="OFERTAS"
            products={offerProducts}
            loading={loading}
          />
        </Suspense>
      </motion.section>

      {/* Vertical Brand Carousel */}
      <motion.section 
        className="py-8 sm:py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <h2 className="text-2xl sm:text-3xl font-outfit font-light text-neutral-900 mb-2 tracking-wide">
              MARCAS PREMIUM
            </h2>
            <p className="text-neutral-600 text-sm max-w-2xl mx-auto font-light">
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
