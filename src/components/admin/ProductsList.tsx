
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  clone_category: string;
  price: number;
  original_price?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_sold_out?: boolean;
  is_bestseller?: boolean;
  is_coming_soon?: boolean;
  custom_badge?: string;
  images: string[];
  created_at: string;
}

interface ProductsListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  loading,
  onEdit,
  onDelete,
  onView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCloneCategory, setFilterCloneCategory] = useState('all');
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesCloneCategory = filterCloneCategory === 'all' || product.clone_category === filterCloneCategory;
    
    return matchesSearch && matchesCategory && matchesCloneCategory;
  });

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

  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const uniqueCloneCategories = [...new Set(products.map(p => p.clone_category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter size={20} />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <Input
                placeholder="Buscar por nome ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterCloneCategory} onValueChange={setFilterCloneCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Clone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {uniqueCloneCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
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

                  {/* Preço */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-neutral-900">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-neutral-500 line-through">
                        R$ {product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                      onClick={() => setDeleteProductId(product.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600">Nenhum produto encontrado.</p>
        </div>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteProductId) {
                  onDelete(deleteProductId);
                  setDeleteProductId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsList;
