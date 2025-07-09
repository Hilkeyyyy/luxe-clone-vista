
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
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
  is_sold_out?: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
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
        title: "✅ Produto adicionado!",
        description: `${quantity}x ${product.name}`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  };

  // WHATSAPP DIRETO SEM LOGIN
  const buyViaWhatsApp = async () => {
    if (!product) return;

    try {
      const whatsappNumber = "19999413755";
      const storeUrl = window.location.origin;
      const productUrl = `${storeUrl}/products/${product.id}`;
      const productImage = product.images?.[0] || '';
      
      let message = `🛒 *INTERESSE EM PRODUTO*\n\n`;
      message += `📋 *PRODUTO SELECIONADO:*\n\n`;
      message += `🏷️ *${product.name}*\n`;
      message += `   • Marca: ${product.brand}\n`;
      message += `   • Preço: R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
      message += `   • Quantidade: ${quantity}\n`;
      if (selectedColor) message += `   • Cor: ${selectedColor}\n`;
      if (selectedSize) message += `   • Tamanho: ${selectedSize}\n`;
      message += `   • Link do produto: ${productUrl}\n`;
      if (productImage) message += `   • Imagem: ${productImage}\n`;
      message += `\n📞 Gostaria de mais informações sobre este produto!\n`;
      message += `Formas de pagamento e entrega disponíveis?`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "📱 Redirecionando para WhatsApp",
        description: `Enviando informações do produto ${product.name}.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Erro ao abrir WhatsApp. Tente novamente.",
        variant: "destructive",
      });
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

  const isProductSoldOut = product.is_sold_out || product.stock_status === 'out_of_stock' || !product.in_stock;

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
              {!isProductSoldOut && (
                <div className="flex items-center space-x-4">
                  <span className="font-outfit font-medium text-neutral-900">Quantidade:</span>
                  <div className="flex items-center border-2 border-neutral-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(false)}
                      className="px-4 py-3 hover:bg-neutral-50 transition-colors text-neutral-700 font-medium"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-6 py-3 font-semibold text-lg bg-neutral-50">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(true)}
                      className="px-4 py-3 hover:bg-neutral-50 transition-colors text-neutral-700 font-medium"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* BOTÕES ELEGANTES */}
              <div className="space-y-4">
                {/* Botão Comprar via WhatsApp */}
                {!isProductSoldOut && (
                  <motion.button
                    onClick={buyViaWhatsApp}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl font-outfit font-semibold text-lg shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">💬</span>
                    <span>COMPRAR VIA WHATSAPP</span>
                  </motion.button>
                )}

                {/* Linha com Carrinho e Favoritos */}
                <div className="flex space-x-4">
                  {/* Botão Carrinho */}
                  {!isProductSoldOut && (
                    <motion.button 
                      onClick={addToCart}
                      disabled={isAddingToCart}
                      className={`flex-1 px-6 py-4 rounded-2xl transition-all duration-300 font-outfit font-semibold text-lg shadow-md ${
                        isAddingToCart 
                          ? 'bg-green-600 text-white' 
                          : 'bg-neutral-900 text-white hover:bg-neutral-800'
                      } ${isAddingToCart ? 'opacity-70' : 'hover:scale-[1.02]'} flex items-center justify-center space-x-2`}
                      whileHover={{ scale: isAddingToCart ? 1 : 1.02 }}
                      whileTap={{ scale: isAddingToCart ? 1 : 0.98 }}
                    >
                      {isAddingToCart ? (
                        <>
                          <span className="text-xl">✅</span>
                          <span>Adicionado!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl">🛒</span>
                          <span>Adicionar ao Carrinho</span>
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Botão Favoritar */}
                  <motion.button
                    onClick={toggleFavorite}
                    className="px-6 py-4 bg-white border-2 border-neutral-200 rounded-2xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 shadow-md flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`text-2xl ${isFavorite ? '❤️' : '🤍'}`}>
                      {isFavorite ? '❤️' : '🤍'}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Status Esgotado */}
              {isProductSoldOut && (
                <div className="text-center py-4 px-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                  <span className="text-red-600 font-semibold text-lg">❌ Produto Esgotado</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Product Specifications - MANTÉM A SEÇÃO EDITÁVEL */}
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
