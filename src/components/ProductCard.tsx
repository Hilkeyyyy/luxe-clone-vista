
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
  clone_category
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
        clone_category: clone_category
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Animação do botão
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
    
    const whatsappUrl = `https://wa.me/5586988388124?text=${encodeURIComponent(message)}`;
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
        return 'bg-blue-600 text-white';
      case 'Clone':
        return 'bg-amber-600 text-white';
      case 'Super Clone':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-neutral-600 text-white';
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
        featured ? 'ring-2 ring-neutral-200' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center relative overflow-hidden">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          {featured && (
            <div className="bg-neutral-800 text-white px-3 py-1 rounded-full text-xs font-outfit font-medium">
              Destaque
            </div>
          )}
          {isNew && (
            <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-outfit font-medium">
              Novo
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-outfit font-medium">
              -{discountPercentage}%
            </div>
          )}
          {clone_category && (
            <div className={`px-3 py-1 rounded-full text-xs font-outfit font-medium ${getCategoryBadgeColor(clone_category)}`}>
              {clone_category}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={toggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite 
                ? 'bg-red-100 text-red-600' 
                : 'bg-white/80 text-neutral-600 hover:bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
          
          <AnimatePresence mode="wait">
            <motion.button
              onClick={addToCart}
              className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                isAddedToCart 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white/80 text-neutral-600 hover:bg-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              key={isAddedToCart ? 'added' : 'add'}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {isAddedToCart ? <Check size={18} /> : <ShoppingCart size={18} />}
            </motion.button>
          </AnimatePresence>

          <motion.button
            onClick={buyViaWhatsApp}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle size={18} />
          </motion.button>
        </div>

        {/* Product Image */}
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-32 h-32 bg-neutral-200 rounded-full flex items-center justify-center">
            <span className="text-neutral-500 font-outfit font-medium text-lg">IMG</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-outfit font-semibold text-xl text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
          {name}
        </h3>
        <p className="text-neutral-600 font-outfit mb-4">
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
            className={`px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-outfit font-medium transition-all text-sm ${
              isAddedToCart 
                ? 'bg-green-50 border-green-300 text-green-700' 
                : 'hover:bg-neutral-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isAddedToCart) {
                addToCart(e);
              }
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isAddedToCart ? 'added' : 'add'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isAddedToCart ? 'Produto Adicionado' : 'Adicionar ao Carrinho'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
