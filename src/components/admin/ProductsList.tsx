
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
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
  const [deleteProductName, setDeleteProductName] = useState<string>('');
  const [productUsageInfo, setProductUsageInfo] = useState<{
    cartCount: number;
    favoritesCount: number;
  }>({ cartCount: 0, favoritesCount: 0 });
  const [deletionInProgress, setDeletionInProgress] = useState(false);

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

  // Verificar uso do produto quando for abrir o modal de exclusão
  const handleDeleteClick = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    console.log('🔍 Verificando uso do produto:', product.name);
    setDeleteProductName(product.name);
    
    try {
      // Verificar quantos itens existem no carrinho e favoritos simultaneamente
      const [cartResult, favResult] = await Promise.all([
        supabase
          .from('cart_items')
          .select('id', { count: 'exact', head: true })
          .eq('product_id', productId),
        supabase
          .from('favorites')
          .select('id', { count: 'exact', head: true })
          .eq('product_id', productId)
      ]);

      if (cartResult.error || favResult.error) {
        console.error('Erro ao verificar uso do produto:', cartResult.error || favResult.error);
        setProductUsageInfo({ cartCount: 0, favoritesCount: 0 });
      } else {
        const cartCount = cartResult.count || 0;
        const favoritesCount = favResult.count || 0;
        
        console.log(`📊 Produto "${product.name}": ${cartCount} no carrinho, ${favoritesCount} favoritos`);
        setProductUsageInfo({ cartCount, favoritesCount });
      }
    } catch (error) {
      console.error('Erro ao verificar uso do produto:', error);
      setProductUsageInfo({ cartCount: 0, favoritesCount: 0 });
    }

    setDeleteProductId(productId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteProductId && !deletionInProgress) {
      setDeletionInProgress(true);
      try {
        await onDelete(deleteProductId);
        setDeleteProductId(null);
        setDeleteProductName('');
        setProductUsageInfo({ cartCount: 0, favoritesCount: 0 });
      } catch (error) {
        console.error('Erro na exclusão:', error);
        // Modal permanece aberto para o usuário tentar novamente
      } finally {
        setDeletionInProgress(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    if (!deletionInProgress) {
      setDeleteProductId(null);
      setDeleteProductName('');
      setProductUsageInfo({ cartCount: 0, favoritesCount: 0 });
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
            onDelete={handleDeleteClick}
            onView={onView}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600">Nenhum produto encontrado.</p>
        </div>
      )}

      {/* Dialog de Confirmação de Exclusão Melhorado */}
      <AlertDialog open={!!deleteProductId} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deletionInProgress ? 'Excluindo Produto...' : 'Confirmar Exclusão'}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              {deletionInProgress ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin mr-3"></div>
                  <span>Excluindo produto e limpando dependências...</span>
                </div>
              ) : (
                <>
                  <p>
                    Tem certeza que deseja excluir o produto <strong>"{deleteProductName}"</strong>?
                  </p>
                  
                  {(productUsageInfo.cartCount > 0 || productUsageInfo.favoritesCount > 0) ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 font-medium mb-2">⚠️ Atenção - Impacto nos Usuários:</p>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        {productUsageInfo.cartCount > 0 && (
                          <li>• <strong>{productUsageInfo.cartCount}</strong> usuário(s) têm este produto no carrinho</li>
                        )}
                        {productUsageInfo.favoritesCount > 0 && (
                          <li>• <strong>{productUsageInfo.favoritesCount}</strong> usuário(s) têm este produto nos favoritos</li>
                        )}
                      </ul>
                      <p className="text-yellow-700 text-sm mt-2 font-medium">
                        ✅ O sistema irá automaticamente remover estes itens dos carrinhos e favoritos dos usuários.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm">
                        ✅ Este produto não está sendo usado por nenhum usuário e pode ser excluído com segurança.
                      </p>
                    </div>
                  )}
                  
                  <p className="text-sm text-neutral-600 font-medium">
                    ⚠️ Esta ação não pode ser desfeita.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleDeleteCancel}
              disabled={deletionInProgress}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletionInProgress}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {deletionInProgress ? 'Excluindo...' : 'Confirmar Exclusão'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsList;
