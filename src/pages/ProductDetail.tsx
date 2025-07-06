
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus, Shield, Truck, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/product/ImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductSpecs from '@/components/product/ProductSpecs';
import ProductActions from '@/components/product/ProductActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  description?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  specifications?: any;
  in_stock: boolean;
  is_new: boolean;
  category: string;
  stock_status?: string;
  movement?: string;
  diameter?: string;
  material?: string;
  water_resistance?: string;
}

interface ProductOptions {
  warranty_enabled: boolean;
  warranty_info: string;
  delivery_enabled: boolean;
  delivery_info: string;
  quality_enabled: boolean;
  quality_info: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [productOptions, setProductOptions] = useState<ProductOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchProductOptions();
      checkIfFavorite();
    }
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProduct(data);
      if (data.colors.length > 0) setSelectedColor(data.colors[0]);
      if (data.sizes.length > 0) setSelectedSize(data.sizes[0]);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o produto.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'warranty_enabled', 'warranty_info',
          'delivery_enabled', 'delivery_info',
          'quality_enabled', 'quality_info'
        ]);

      if (error) throw error;

      const options: ProductOptions = {
        warranty_enabled: false,
        warranty_info: '',
        delivery_enabled: false,
        delivery_info: '',
        quality_enabled: false,
        quality_info: ''
      };

      data?.forEach(item => {
        const key = item.setting_key as keyof ProductOptions;
        if (key.includes('_enabled')) {
          (options as any)[key] = Boolean(item.setting_value);
        } else {
          (options as any)[key] = String(item.setting_value || '').replace(/"/g, '');
        }
      });

      setProductOptions(options);
    } catch (error) {
      console.error('Erro ao buscar opções do produto:', error);
    }
  };

  const checkIfFavorite = () => {
    if (isAuthenticated) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(id));
    }
  };

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((fav: string) => fav !== id);
      toast({
        title: "Removido dos favoritos",
        description: `${product?.name} foi removido dos seus favoritos.`,
      });
    } else {
      newFavorites = [...favorites, id];
      toast({
        title: "Adicionado aos favoritos",
        description: `${product?.name} foi adicionado aos seus favoritos.`,
      });
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const addToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cartItems.findIndex(
        (item: any) => 
          item.productId === product.id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
      );

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({
          productId: product.id,
          selectedColor: selectedColor,
          selectedSize: selectedSize,
          quantity: quantity,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      toast({
        title: "Produto adicionado ao carrinho!",
        description: `${quantity}x ${product.name} foi adicionado ao seu carrinho.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const updateQuantity = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
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
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Produto não encontrado</h2>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
            >
              Voltar ao início
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
        {/* Breadcrumb */}
        <motion.div 
          className="flex items-center space-x-2 text-sm text-neutral-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button onClick={() => navigate('/')} className="hover:text-neutral-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="capitalize">{product?.category}</span>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{product?.name}</span>
        </motion.div>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ImageGallery images={product?.images || []} productName={product?.name || ''} />

          {/* Product Info */}
          <div className="space-y-8">
            <ProductInfo 
              product={product}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
            />

            {/* Quantity & Actions */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="font-outfit font-medium text-neutral-900">Quantidade:</span>
                <div className="flex items-center border border-neutral-200 rounded-xl">
                  <button
                    onClick={() => updateQuantity(false)}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-3 font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(true)}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <ProductActions
                isFavorite={isFavorite}
                isSoldOut={!!(product?.stock_status === 'out_of_stock' || !product?.in_stock)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
                onBuyNow={addToCart}
                showBuyButton={true}
              />

              {(product?.stock_status === 'out_of_stock' || !product?.in_stock) && (
                <div className="text-center py-3 px-4 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-red-600 font-medium">Produto fora de estoque</span>
                </div>
              )}
            </motion.div>

            {/* Product Options */}
            {productOptions && (
              <motion.div 
                className="space-y-4 border-t border-neutral-200 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Informações Adicionais</h3>
                
                {productOptions.warranty_enabled && (
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Garantia</h4>
                      <p className="text-sm text-blue-700">{productOptions.warranty_info}</p>
                    </div>
                  </div>
                )}

                {productOptions.delivery_enabled && (
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                    <Truck className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Entrega</h4>
                      <p className="text-sm text-green-700">{productOptions.delivery_info}</p>
                    </div>
                  </div>
                )}

                {productOptions.quality_enabled && (
                  <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-xl">
                    <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900">Qualidade</h4>
                      <p className="text-sm text-purple-700">{productOptions.quality_info}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Product Specifications */}
        {product?.specifications && (
          <ProductSpecs specifications={product.specifications} />
        )}
      </div>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={() => {
          setShowAuthModal(false);
          checkIfFavorite();
        }}
      />
    </div>
  );
};

export default ProductDetail;
