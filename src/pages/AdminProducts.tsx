
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/admin/AdminGuard';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Verificar se deve abrir formulário automaticamente
  React.useEffect(() => {
    if (location.pathname === '/admin/produtos/novo' || location.pathname.includes('/novo')) {
      console.log('🆕 Abrindo formulário de novo produto automaticamente');
      setShowForm(true);
    }
  }, [location.pathname]);

  const handleCreateProduct = async (productData: any) => {
    setFormLoading(true);
    try {
      console.log('➕ Criando novo produto:', productData);
      await createProduct(productData);
      setShowForm(false);
      navigate('/admin/products');
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
      console.log('✏️ Atualizando produto:', editingProduct.id);
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
    console.log('✏️ Editando produto:', product.name);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleViewProduct = (product: Product) => {
    console.log('👁️ Visualizando produto:', product.name);
    window.open(`/products/${product.id}`, '_blank');
  };

  const handleDeleteProduct = async (id: string) => {
    console.log('🗑️ Deletando produto:', id);
    await deleteProduct(id);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    if (location.pathname.includes('/novo')) {
      navigate('/admin/products');
    }
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
                  <span>Voltar ao Dashboard</span>
                </button>
                <span className="text-neutral-500">|</span>
                <h1 className="text-2xl font-bold text-neutral-900">Gerenciar Produtos</h1>
              </div>
              
              <Button 
                onClick={() => {
                  setShowForm(true);
                  navigate('/admin/products');
                }} 
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingProduct ? `Editar Produto: ${editingProduct.name}` : 'Novo Produto'}
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
