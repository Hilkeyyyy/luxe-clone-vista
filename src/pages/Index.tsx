
import React, { Suspense, lazy, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CarouselSkeleton from '@/components/ui/CarouselSkeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProductsByType } from '@/hooks/useProductsByType';
import { useBrandCategories } from '@/hooks/useBrandCategories';

// Lazy loading otimizado com preload
const BrandCategoryCarousel = lazy(() => 
  import('@/components/BrandCategoryCarousel').then(module => ({ 
    default: module.default 
  }))
);
const ProductCarousel = lazy(() => 
  import('@/components/ProductCarousel').then(module => ({ 
    default: module.default 
  }))
);
const FeaturedProductsGrid = lazy(() => 
  import('@/components/FeaturedProductsGrid').then(module => ({ 
    default: module.default 
  }))
);

// Preload crítico
const preloadComponents = () => {
  import('@/components/BrandCategoryCarousel');
  import('@/components/ProductCarousel');
  import('@/components/FeaturedProductsGrid');
};

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();
  const { categories, loading: categoriesLoading } = useBrandCategories(true);

  // Preload componentes após carregamento inicial
  React.useEffect(() => {
    const timer = setTimeout(preloadComponents, 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoizar transformação de dados para evitar re-renders
  const brands = useMemo(() => {
    return categories.map(category => ({
      name: category.name,
      count: category.products_count || 0,
      image: category.image_url || undefined
    }));
  }, [categories]);

  // Componente de loading otimizado
  const OptimizedSkeleton = React.memo(() => <CarouselSkeleton />);
  const OptimizedSpinner = React.memo(() => <LoadingSpinner />);

  return (
    <div className="min-h-screen font-outfit bg-neutral-50">
      <Header />
      
      {/* Hero Section Premium - Carregamento prioritário */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
      </motion.div>

      {/* MARCAS PREMIUM - Lazy loading com skeleton */}
      <motion.section 
        className="py-16 sm:py-20 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-4xl sm:text-5xl font-outfit font-light text-neutral-900 mb-6 tracking-wide">
              MARCAS PREMIUM
            </h2>
            <p className="text-neutral-600 text-xl max-w-2xl mx-auto font-light">
              Explore nossa seleção exclusiva das melhores marcas de relógios do mundo
            </p>
          </motion.div>
          
          <Suspense fallback={<OptimizedSkeleton />}>
            <BrandCategoryCarousel brands={brands} />
          </Suspense>
        </div>
      </motion.section>

      {/* Featured Products - Otimizado */}
      <motion.section 
        id="featured-section"
        className="py-16 sm:py-20 bg-neutral-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl sm:text-5xl font-outfit font-light text-neutral-900 mb-6 tracking-wide">
              PRODUTOS EM DESTAQUE
            </h2>
            <p className="text-neutral-600 text-xl max-w-2xl mx-auto font-light">
              Os relógios mais procurados e admirados da nossa coleção
            </p>
          </motion.div>
          
          <Suspense fallback={<OptimizedSpinner />}>
            <FeaturedProductsGrid products={featuredProducts} loading={loading} />
          </Suspense>
        </div>
      </motion.section>

      {/* New Arrivals - Lazy loading */}
      <motion.section 
        className="py-16 sm:py-20 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Suspense fallback={<OptimizedSkeleton />}>
          <ProductCarousel 
            title="NOVIDADES"
            subtitle="Últimos lançamentos e tendências em relógios premium"
            products={newProducts}
            loading={loading}
          />
        </Suspense>
      </motion.section>

      {/* Offers - Lazy loading */}
      <motion.section 
        className="py-16 sm:py-20 bg-neutral-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Suspense fallback={<OptimizedSkeleton />}>
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
