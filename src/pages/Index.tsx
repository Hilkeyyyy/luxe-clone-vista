
import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CarouselSkeleton from '@/components/ui/CarouselSkeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProductsByType } from '@/hooks/useProductsByType';
import { useBrandCategories } from '@/hooks/useBrandCategories';

// Lazy loading dos componentes pesados
const BrandCategoryCarousel = lazy(() => import('@/components/BrandCategoryCarousel'));
const ProductCarousel = lazy(() => import('@/components/ProductCarousel'));
const FeaturedProductsGrid = lazy(() => import('@/components/FeaturedProductsGrid'));

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();
  const { categories, loading: categoriesLoading } = useBrandCategories(true);

  // Transformar categorias em formato esperado pelo componente
  const brands = categories.map(category => ({
    name: category.name,
    count: category.products_count || 0
  }));

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

      {/* MARCAS PREMIUM no topo (logo após hero) */}
      <motion.section 
        className="py-12 sm:py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-outfit font-light text-neutral-900 mb-4 tracking-wide">
              MARCAS PREMIUM
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto font-light">
              Explore nossa seleção exclusiva das melhores marcas de relógios do mundo
            </p>
          </motion.div>
          
          <Suspense fallback={<CarouselSkeleton />}>
            <BrandCategoryCarousel brands={brands} />
          </Suspense>
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section 
        id="featured-section"
        className="py-12 sm:py-16 bg-neutral-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-outfit font-light text-neutral-900 mb-4 tracking-wide">
              PRODUTOS EM DESTAQUE
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto font-light">
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
        className="py-12 sm:py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Suspense fallback={<CarouselSkeleton />}>
          <ProductCarousel 
            title="NOVIDADES"
            subtitle="Últimos lançamentos e tendências em relógios premium"
            products={newProducts}
            loading={loading}
          />
        </Suspense>
      </motion.section>

      {/* Offers */}
      <motion.section 
        className="py-12 sm:py-16 bg-neutral-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Suspense fallback={<CarouselSkeleton />}>
          <ProductCarousel 
            title="OFERTAS ESPECIAIS"
            subtitle="Oportunidades imperdíveis em relógios selecionados"
            products={offerProducts}
            loading={loading}
          />
        </Suspense>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Index;
