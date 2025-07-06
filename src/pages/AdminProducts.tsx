
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/admin/AdminGuard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProducts } from '@/hooks/useProducts';
import ProductsList from '@/components/admin/ProductsList';
import ProductForm from '@/components/admin/ProductForm';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  clone_category: string;
  price: number;
  original_price?: number;
  description?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  is_featured?: boolean;
  is_new?: boolean;
  is_sold_out?: boolean;
  is_bestseller?: boolean;
  is_coming_soon?: boolean;
  custom_badge?: string;
  movement?: string;
  diameter?: string;
  material?: string;
  water_resistance?: string;
  specifications?: any;
  brand_category_id?: string;
  created_at: string;
  updated_at: string;
}

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateProduct = async (productData: any) => {
    setFormLoading(true);
    try {
      await createProduct(productData);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return;
    
    setFormLoading(true);
    try {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleViewProduct = (product: Product) => {
    // CORREÇÃO: Usar rota correta /products/ em vez de /produto/
    navigate(`/products/${product.id}`);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-50 font-outfit">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Voltar</span>
                </button>
                <span className="text-neutral-500">|</span>
                <h1 className="text-2xl font-bold text-neutral-900">Gerenciar Produtos</h1>
              </div>
              
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus size={20} />
                <span>Novo Produto</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductsList
              products={products}
              loading={loading}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onView={handleViewProduct}
            />
          </motion.div>
        </div>

        {/* Dialog do Formulário */}
        <Dialog open={showForm} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            
            <ProductForm
              initialData={editingProduct || {}}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={handleCloseForm}
              loading={formLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
};

export default AdminProducts;
