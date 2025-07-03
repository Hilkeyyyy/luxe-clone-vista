
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from './ProductsListTypes';

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

const getProductBadges = (product: Product) => {
  const badges = [];
  
  if (product.is_featured) badges.push({ label: 'Destaque', color: 'bg-yellow-600' });
  if (product.is_new) badges.push({ label: 'Novo', color: 'bg-green-600' });
  if (product.is_bestseller) badges.push({ label: 'Mais Vendido', color: 'bg-blue-600' });
  if (product.is_sold_out) badges.push({ label: 'Esgotado', color: 'bg-red-600' });
  if (product.is_coming_soon) badges.push({ label: 'Em Breve', color: 'bg-purple-600' });
  if (product.custom_badge) badges.push({ label: product.custom_badge, color: 'bg-neutral-600' });
  
  return badges;
};

const getCloneCategoryColor = (category: string) => {
  switch (category) {
    case 'ETA Básico': return 'bg-blue-100 text-blue-800';
    case 'Clone': return 'bg-amber-100 text-amber-800';
    case 'Super Clone': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-neutral-100 text-neutral-800';
  }
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onEdit,
  onDelete,
  onView
}) => {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          {/* Imagem do Produto */}
          <div className="aspect-square bg-neutral-100 rounded-lg mb-4 overflow-hidden">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                Sem Imagem
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <p className="text-neutral-600 text-sm">{product.brand}</p>
            </div>

            {/* Preço com formatação brasileira */}
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-neutral-900">
                {formatCurrency(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-neutral-500 line-through">
                  {formatCurrency(product.original_price)}
                </span>
              )}
            </div>

            {/* Tipo de Clone */}
            <Badge className={getCloneCategoryColor(product.clone_category)}>
              {product.clone_category}
            </Badge>

            {/* Badges de Status */}
            <div className="flex flex-wrap gap-1">
              {getProductBadges(product).map((badge, idx) => (
                <Badge
                  key={idx}
                  className={`${badge.color} text-white text-xs`}
                >
                  {badge.label}
                </Badge>
              ))}
            </div>

            {/* Ações */}
            <div className="flex space-x-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView(product)}
                className="flex-1"
              >
                <Eye size={16} className="mr-1" />
                Ver
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(product)}
                className="flex-1"
              >
                <Edit size={16} className="mr-1" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
