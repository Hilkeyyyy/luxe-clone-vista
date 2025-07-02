
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  clone_category: string;
}

interface CarouselConfig {
  id: string;
  product_id: string;
  carousel_type: string;
  position: number;
  product?: Product;
}

const AdminLanding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [carouselConfigs, setCarouselConfigs] = useState<CarouselConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCarouselType, setSelectedCarouselType] = useState('novidades');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [editingConfig, setEditingConfig] = useState<CarouselConfig | null>(null);

  const carouselTypes = [
    { value: 'novidades', label: 'Carrossel Novidades' },
    { value: 'mais-vendidos', label: 'Carrossel Mais Vendidos' }
  ];

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      navigate('/admin');
      return;
    }
  };

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, brand, price, original_price, images, clone_category')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch carousel configs
      const { data: configsData, error: configsError } = await supabase
        .from('carousel_config')
        .select('*')
        .order('carousel_type', { ascending: true })
        .order('position', { ascending: true });

      if (configsError) throw configsError;

      setProducts(productsData || []);
      setCarouselConfigs(configsData || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setLoading(true);

    try {
      // Get next position for the carousel type
      const existingConfigs = carouselConfigs.filter(c => c.carousel_type === selectedCarouselType);
      const nextPosition = editingConfig ? editingConfig.position : existingConfigs.length;

      const configData = {
        product_id: selectedProductId,
        carousel_type: selectedCarouselType,
        position: nextPosition
      };

      let error;
      if (editingConfig) {
        ({ error } = await supabase
          .from('carousel_config')
          .update(configData)
          .eq('id', editingConfig.id));
      } else {
        ({ error } = await supabase
          .from('carousel_config')
          .insert([configData]));
      }

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Produto ${editingConfig ? 'atualizado' : 'adicionado'} ao carrossel.`,
      });

      setShowDialog(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração do carrossel.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este produto do carrossel?')) return;

    try {
      const { error } = await supabase
        .from('carousel_config')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto removido do carrossel.",
      });

      fetchData();
    } catch (error) {
      console.error('Erro ao remover produto do carrossel:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover produto do carrossel.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (config: CarouselConfig) => {
    setEditingConfig(config);
    setSelectedCarouselType(config.carousel_type);
    setSelectedProductId(config.product_id);
    setShowDialog(true);
  };

  const resetForm = () => {
    setEditingConfig(null);
    setSelectedCarouselType('novidades');
    setSelectedProductId('');
  };

  const updatePosition = async (configId: string, newPosition: number) => {
    try {
      const { error } = await supabase
        .from('carousel_config')
        .update({ position: newPosition })
        .eq('id', configId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Erro ao atualizar posição:', error);
    }
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getConfigsByType = (type: string) => {
    return carouselConfigs
      .filter(c => c.carousel_type === type)
      .sort((a, b) => a.position - b.position);
  };

  if (loading && carouselConfigs.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
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
              <h1 className="text-2xl font-bold text-neutral-900">Configurar Landing Page</h1>
            </div>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-neutral-900 hover:bg-neutral-800">
                  <Plus size={20} className="mr-2" />
                  Adicionar ao Carrossel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingConfig ? 'Editar Produto no Carrossel' : 'Adicionar Produto ao Carrossel'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="carousel_type">Tipo de Carrossel</Label>
                    <select
                      id="carousel_type"
                      value={selectedCarouselType}
                      onChange={(e) => setSelectedCarouselType(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
                      required
                    >
                      {carouselTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="product_id">Produto</Label>
                    <select
                      id="product_id"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
                      required
                    >
                      <option value="">Selecione um produto</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.brand} (R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-neutral-900 hover:bg-neutral-800"
                    >
                      {loading ? 'Salvando...' : editingConfig ? 'Atualizar' : 'Adicionar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Carrossel Novidades */}
          <Card>
            <CardHeader>
              <CardTitle>Carrossel de Novidades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getConfigsByType('novidades').map((config, index) => {
                    const product = getProductById(config.product_id);
                    if (!product) return null;
                    
                    return (
                      <TableRow key={config.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <GripVertical size={16} className="text-neutral-400" />
                            <span>{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <span>{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(config)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(config.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Carrossel Mais Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle>Carrossel de Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getConfigsByType('mais-vendidos').map((config, index) => {
                    const product = getProductById(config.product_id);
                    if (!product) return null;
                    
                    return (
                      <TableRow key={config.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <GripVertical size={16} className="text-neutral-400" />
                            <span>{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <span>{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(config)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(config.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLanding;
