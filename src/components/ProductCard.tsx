
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, MessageCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id?: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  featured?: boolean;
  delay?: number;
  isNew?: boolean;
  image?: string;
  clone_category?: string;
  stock_status?: string;
}

const ProductCard = ({ 
  id,
  name, 
  brand, 
  price, 
  originalPrice, 
  featured = false, 
  delay = 0, 
  isNew = false,
  image,
  clone_category,
  stock_status = 'in_stock'
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    updateFavoriteStatus();
    window.addEventListener('storage', updateFavoriteStatus);
    return () => window.removeEventListener('storage', updateFavoriteStatus);
  }, [id]);

  const updateFavoriteStatus = () => {
    if (!id) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(id));
  };

  const handleClick = () => {
    if (id) {
      navigate(`/produto/${id}`);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isCurrentlyFavorite = favorites.includes(id);

    if (isCurrentlyFavorite) {
      const newFavorites = favorites.filter((favId: string) => favId !== id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        title: "Removido dos favoritos",
        description: `${name} foi removido dos seus favoritos.`,
      });
    } else {
      favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "Adicionado aos favoritos",
        description: `${name} foi adicionado aos seus favoritos.`,
      });
    }

    window.dispatchEvent(new Event('storage'));
  };

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex((item: any) => item.product_id === id);

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        id: Date.now().toString(),
        product_id: id,
        product_name: name,
        product_price: parseFloat(price.replace('R$ ', '').replace('.', '').replace(',', '.')),
        product_image: image || '',
        selected_color: '',
        selected_size: '',
        quantity: 1,
        brand: brand,
        clone_category: clone_category,
        stock_status: stock_status
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
    
    toast({
      title: "Produto adicionado!",
      description: `${name} foi adicionado à sua lista de interesse.`,
    });

    window.dispatchEvent(new Event('storage'));
  };

  const buyViaWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;

    const message = `Olá! Tenho interesse neste produto:\n\n${name} - ${brand}\nPreço: ${price}\n\nPoderia me enviar mais informações?`;
    
    const whatsappUrl = `https://wa.me/19999413755?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const discountPercentage = originalPrice && originalPrice !== price
    ? Math.round(((parseFloat(originalPrice.replace('R$ ', '').replace('.', '').replace(',', '.')) - 
                  parseFloat(price.replace('R$ ', '').replace('.', '').replace(',', '.'))) / 
                  parseFloat(originalPrice.replace('R$ ', '').replace('.', '').replace(',', '.'))) * 100)
    : 0;

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'ETA Base':
        return 'bg-blue-500 text-white';
      case 'Clone':
        return 'bg-purple-500 text-white';
      case 'Super Clone':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-neutral-600 text-white';
    }
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return {
          label: 'Em Estoque',
          color: 'bg-green-500 text-white'
        };
      case 'low_stock':
        return {
          label: 'Pouco Estoque',
          color: 'bg-yellow-500 text-white'
        };
      case 'out_of_stock':
        return {
          label: 'Fora de Estoque',
          color: 'bg-red-500 text-white'
        };
      default:
        return {
          label: 'Em Estoque',
          color: 'bg-green-500 text-white'
        };
    }
  };

  const stockBadge = getStockBadge(stock_status);

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-neutral-100 ${
        featured ? 'ring-2 ring-amber-400' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={handleClick}
    >
      <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center relative overflow-hidden">
        {/* Badges - Reorganizado */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          {featured && (
            <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-outfit font-semibold shadow-lg">
              Destaque
            </div>
          )}
          {isNew && (
            <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-outfit font-semibold shadow-lg">
              Novo
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-outfit font-semibold shadow-lg">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Stock Status Badge - Canto inferior esquerdo */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-outfit font-semibold shadow-lg ${stockBadge.color}`}>
            {stockBadge.label}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            onClick={toggleFavorite}
            className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-100 text-red-600 scale-110' 
                : 'bg-white/90 text-neutral-600 hover:bg-white hover:scale-110'
            }`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
          
          <AnimatePresence mode="wait">
            <motion.button
              onClick={addToCart}
              className={`p-3 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 ${
                isAddedToCart 
                  ? 'bg-green-600 text-white scale-110' 
                  : 'bg-white/90 text-neutral-600 hover:bg-white hover:scale-110'
              }`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              key={isAddedToCart ? 'added' : 'add'}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              disabled={stock_status === 'out_of_stock'}
            >
              {isAddedToCart ? <Check size={18} /> : <ShoppingCart size={18} />}
            </motion.button>
          </AnimatePresence>

          <motion.button
            onClick={buyViaWhatsApp}
            className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={18} />
          </motion.button>
        </div>

        {/* Product Image */}
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center">
            <span className="text-neutral-500 font-outfit font-medium text-sm">IMG</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Clone Category Badge */}
        {clone_category && (
          <div className="mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(clone_category)}`}>
              {clone_category}
            </span>
          </div>
        )}

        <h3 className="font-outfit font-bold text-lg text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors line-clamp-2">
          {name}
        </h3>
        <p className="text-neutral-600 font-outfit mb-4 font-medium">
          {brand}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-outfit font-bold text-neutral-900">
              {price}
            </span>
            {originalPrice && originalPrice !== price && (
              <span className="text-sm text-neutral-500 line-through">
                {originalPrice}
              </span>
            )}
          </div>
          
          <motion.button
            className={`px-4 py-2 rounded-xl font-outfit font-semibold transition-all text-sm border-2 ${
              stock_status === 'out_of_stock'
                ? 'bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed'
                : isAddedToCart 
                  ? 'bg-green-50 border-green-300 text-green-700' 
                  : 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800'
            }`}
            whileHover={stock_status !== 'out_of_stock' ? { scale: 1.05 } : {}}
            whileTap={stock_status !== 'out_of_stock' ? { scale: 0.95 } : {}}
            onClick={(e) => {
              e.stopPropagation();
              if (!isAddedToCart && stock_status !== 'out_of_stock') {
                addToCart(e);
              }
            }}
            disabled={stock_status === 'out_of_stock'}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={stock_status === 'out_of_stock' ? 'unavailable' : isAddedToCart ? 'added' : 'add'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {stock_status === 'out_of_stock' 
                  ? 'Indisponível' 
                  : isAddedToCart 
                    ? 'Adicionado' 
                    : 'Adicionar'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
