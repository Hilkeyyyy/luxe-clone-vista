
import React, { useState } from 'react';
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
import { ProductsListProps } from './products-list/ProductsListTypes';
import ProductFilters from './products-list/ProductFilters';
import ProductCard from './products-list/ProductCard';

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

  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const uniqueCloneCategories = [...new Set(products.map(p => p.clone_category))];

  const handleDeleteConfirm = () => {
    if (deleteProductId) {
      onDelete(deleteProductId);
      setDeleteProductId(null);
    }
  };

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
      <ProductFilters
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        filterCloneCategory={filterCloneCategory}
        uniqueCategories={uniqueCategories}
        uniqueCloneCategories={uniqueCloneCategories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setFilterCategory}
        onCloneCategoryChange={setFilterCloneCategory}
      />

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onEdit={onEdit}
            onDelete={setDeleteProductId}
            onView={onView}
          />
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
              onClick={handleDeleteConfirm}
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
