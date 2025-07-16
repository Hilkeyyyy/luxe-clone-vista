
import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CarouselSkeleton from '@/components/ui/CarouselSkeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProductsByType } from '@/hooks/useProductsByType';
import { useBrandCategories } from '@/hooks/useBrandCategories';

// Lazy loading dos componentes pesados - OTIMIZADO
const BrandCategoryCarousel = lazy(() => import('@/components/BrandCategoryCarousel'));
const ProductCarousel = lazy(() => import('@/components/ProductCarousel'));
const FeaturedProductsGrid = lazy(() => import('@/components/FeaturedProductsGrid'));

const Index = () => {
  const { newProducts, featuredProducts, offerProducts, loading } = useProductsByType();
  const { categories, loading: categoriesLoading } = useBrandCategories(true);

  // Transformar categorias em formato esperado pelo componente com imagens - OTIMIZADO
  const brands = React.useMemo(() => {
    return categories.map(category => ({
      name: category.name,
      count: category.products_count || 0,
      image: category.image_url || undefined
    }));
  }, [categories]);

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

      {/* MARCAS PREMIUM no topo - CARDS MUITO MAIORES REDESENHADOS */}
      <motion.section 
        className="py-16 sm:py-20 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
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
          
          <Suspense fallback={<CarouselSkeleton />}>
            <BrandCategoryCarousel brands={brands} />
          </Suspense>
        </div>
      </motion.section>

      {/* Featured Products - OTIMIZADO */}
      <motion.section 
        id="featured-section"
        className="py-16 sm:py-20 bg-neutral-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
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
          
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProductsGrid products={featuredProducts} loading={loading} />
          </Suspense>
        </div>
      </motion.section>

      {/* New Arrivals - OTIMIZADO */}
      <motion.section 
        className="py-16 sm:py-20 bg-white"
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

      {/* Offers - OTIMIZADO */}
      <motion.section 
        className="py-16 sm:py-20 bg-neutral-50"
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
