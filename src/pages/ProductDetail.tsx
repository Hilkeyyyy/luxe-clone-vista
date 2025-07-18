
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductSpecs from '@/components/product/ProductSpecs';
import ProductActions from '@/components/product/ProductActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProducts } from '@/hooks/useProducts';
import { useOptimizedProductActions } from '@/hooks/useOptimizedProductActions';
import { Product } from '@/types/product';

// Lazy load ProductOptions
const ProductOptions = lazy(() => import('@/components/product/ProductOptions'));

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);

  const {
    toggleFavorite,
    addToCart,
    buyNow,
    buySpecificProduct,
    isFavorite,
    getButtonState
  } = useOptimizedProductActions();

  const buttonState = getButtonState(product?.id || '');

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [products, id]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    await toggleFavorite(product.id, product.name);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    await addToCart(product.id, product.name, 1);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;
    await buySpecificProduct(
      product.id,
      product.name,
      product.brand,
      product.price,
      product.images[0] || '',
      1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Produto não encontrado</h2>
            <button
              onClick={() => navigate('/produtos')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Voltar aos produtos
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb otimizado */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </motion.button>

        {/* Layout do produto otimizado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductImageGallery images={product.images} productName={product.name} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <ProductInfo 
              product={{
                ...product,
                in_stock: product.in_stock ?? true
              }}
              selectedColor=""
              selectedSize=""
              onColorChange={() => {}}
              onSizeChange={() => {}}
            />
            <ProductActions
              isFavorite={isFavorite(product.id)}
              isSoldOut={product.is_sold_out || false}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              customBadge={product.custom_badge}
              showBuyButton={true}
              showCartText={true}
              isCartLoading={buttonState.isCartLoading}
              isCartAdded={buttonState.isCartAdded}
              isFavoriteLoading={buttonState.isFavoriteLoading}
              productId={product.id}
            />
          </motion.div>
        </div>

        {/* Especificações e opções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <ProductSpecs specifications={product.specifications} />
          
          {/* Opções do produto (Garantia, Entrega, Qualidade) */}
          <Suspense fallback={
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-neutral-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          }>
            <ProductOptions />
          </Suspense>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
