
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

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

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('storage'));
  };

  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const getBadgeVariant = (type: string) => {
    const variants = {
      custom: 'bg-slate-700 text-white border-slate-600',
      new: 'bg-emerald-700 text-white border-emerald-600',
      featured: 'bg-amber-700 text-white border-amber-600',
      bestseller: 'bg-indigo-700 text-white border-indigo-600',
      discount: 'bg-rose-700 text-white border-rose-600',
      soldout: 'bg-neutral-500 text-white border-neutral-400'
    };
    return variants[type as keyof typeof variants] || variants.custom;
  };

  return (
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
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {custom_badge && (
              <Badge className={`text-xs font-medium px-2 py-1 ${getBadgeVariant('custom')}`}>
                {custom_badge}
              </Badge>
            )}
            {isNew && (
              <Badge className={`text-xs font-medium px-2 py-1 ${getBadgeVariant('new')}`}>
                Novo
              </Badge>
            )}
            {is_featured && (
              <Badge className={`text-xs font-medium px-2 py-1 ${getBadgeVariant('featured')}`}>
                Destaque
              </Badge>
            )}
            {is_bestseller && (
              <Badge className={`text-xs font-medium px-2 py-1 ${getBadgeVariant('bestseller')}`}>
                Mais Vendido
              </Badge>
            )}
            {originalPrice && (
              <Badge className={`text-xs font-medium px-2 py-1 ${getBadgeVariant('discount')}`}>
                Promoção
              </Badge>
            )}
            {is_sold_out && (
              <Badge className={`text-xs font-medium px-2 py-1 ${getBadgeVariant('soldout')}`}>
                Esgotado
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
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

          {/* Category */}
          {clone_category && (
            <p className="text-xs text-neutral-400 mb-3">
              {clone_category}
            </p>
          )}

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
              <button className="p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100">
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
  );
};

export default ProductCard;
