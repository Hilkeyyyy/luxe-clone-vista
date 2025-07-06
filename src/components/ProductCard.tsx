
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  clone_category?: string;
  stock_status?: string;
  is_sold_out?: boolean;
  custom_badge?: string;
  is_bestseller?: boolean;
  is_featured?: boolean;
  isNew?: boolean;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  clone_category,
  stock_status,
  is_sold_out,
  custom_badge,
  is_bestseller,
  is_featured,
  isNew,
  delay = 0,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      toast({
        title: "Removido dos favoritos",
        description: "Produto removido dos seus favoritos.",
      });
    } else {
      favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toast({
        title: "Adicionado aos favoritos",
        description: "Produto adicionado aos seus favoritos.",
      });
    }
    
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cartItems.findIndex((item: any) => item.productId === id);

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        productId: id,
        quantity: 1,
        selectedColor: '',
        selectedSize: ''
      });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    toast({
      title: "Produto adicionado!",
      description: `${name} foi adicionado ao seu carrinho.`,
    });
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(id));
    }
  }, [id, isAuthenticated]);

  const getBadgeVariant = (type: string) => {
    const variants = {
      custom: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500 shadow-lg',
      new: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-lg',
      featured: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-500 shadow-lg',
      bestseller: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-lg',
      discount: 'bg-gradient-to-r from-rose-600 to-rose-700 text-white border-rose-500 shadow-lg',
      soldout: 'bg-gradient-to-r from-neutral-500 to-neutral-600 text-white border-neutral-400 shadow-lg',
      clone: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500 shadow-lg'
    };
    return variants[type as keyof typeof variants] || variants.custom;
  };

  const getCloneCategoryDisplay = (category?: string) => {
    if (!category) return null;
    
    const categoryMap: { [key: string]: string } = {
      'ETA Base': 'ETA BASE',
      'Clone': 'CLONE',
      'Super Clone': 'SUPER CLONE'
    };
    
    return categoryMap[category] || category.toUpperCase();
  };

  return (
    <>
      <motion.div
        className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -4 }}
      >
        <Link to={`/produto/${id}`}>
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-neutral-50">
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Badges - Left Side */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {isNew && (
                <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('new')}`}>
                  NOVO
                </Badge>
              )}
              {is_featured && (
                <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('featured')}`}>
                  DESTAQUE
                </Badge>
              )}
              {is_bestseller && (
                <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('bestseller')}`}>
                  MAIS VENDIDO
                </Badge>
              )}
              {originalPrice && (
                <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('discount')}`}>
                  PROMOÇÃO
                </Badge>
              )}
              {is_sold_out && (
                <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('soldout')}`}>
                  ESGOTADO
                </Badge>
              )}
              {clone_category && (
                <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('clone')}`}>
                  {getCloneCategoryDisplay(clone_category)}
                </Badge>
              )}
            </div>

            {/* Custom Badge - Top Right */}
            {custom_badge && (
              <div className="absolute top-3 right-3">
                <Badge className={`text-xs font-bold px-3 py-1 ${getBadgeVariant('custom')} animate-pulse`}>
                  {custom_badge.toUpperCase()}
                </Badge>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              style={{ top: custom_badge ? '60px' : '12px' }}
            >
              <Heart
                size={16}
                className={`transition-colors ${
                  isFavorite ? 'text-red-600 fill-red-600' : 'text-neutral-600 hover:text-red-600'
                }`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                {brand}
              </p>
              <h3 className="font-semibold text-neutral-900 line-clamp-2 leading-snug">
                {name}
              </h3>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {originalPrice && (
                  <span className="text-xs text-neutral-400 line-through">
                    {originalPrice}
                  </span>
                )}
                <span className="text-lg font-bold text-neutral-900">
                  {price}
                </span>
              </div>
              
              {!is_sold_out && (
                <button 
                  onClick={addToCart}
                  className="p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ShoppingCart size={16} />
                </button>
              )}
            </div>

            {/* Stock Status */}
            {stock_status && stock_status !== 'in_stock' && (
              <div className="mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    stock_status === 'low_stock'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {stock_status === 'low_stock' ? 'Pouco Estoque' : 'Fora de Estoque'}
                </span>
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={() => {
          setShowAuthModal(false);
          // Re-trigger the action after successful login
          if (authMode === 'login') {
            setTimeout(() => {
              // This will be handled by the auth state change
            }, 100);
          }
        }}
      />
    </>
  );
};

export default ProductCard;
