
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProductsApi } from './useProductsApi';

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { fetchProducts, createProduct: apiCreateProduct, updateProduct: apiUpdateProduct, deleteProduct: apiDeleteProduct } = useProductsApi();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    try {
      const data = await apiCreateProduct(productData);
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar produto.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    try {
      const data = await apiUpdateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar produto.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiDeleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir produto.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: loadProducts
  };
};
