
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Image, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { useBrandCategories } from '@/hooks/useBrandCategories';
import CategoryImageUpload from './CategoryImageUpload';
import { useToast } from '@/hooks/use-toast';

interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  order_position: number;
  is_active: boolean;
  products_count: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

const CategoryManager = () => {
  const { categories, loading, refetch } = useBrandCategories();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BrandCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<BrandCategory | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image_url: '',
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      is_active: true
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: BrandCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
      is_active: category.is_active
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (editingCategory) {
        // Atualizar categoria existente
        const { error } = await supabase
          .from('brand_categories')
          .update({
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url,
            is_active: formData.is_active,
            slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso!",
        });
      } else {
        // Criar nova categoria
        const { error } = await supabase
          .from('brand_categories')
          .insert({
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url,
            is_active: formData.is_active,
            slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            order_position: categories.length
          });

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Categoria criada com sucesso!",
        });
      }

      await refetch();
      setShowForm(false);
      resetForm();
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar categoria. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('brand_categories')
        .delete()
        .eq('id', deleteCategory.id);

      if (error) throw error;

      await refetch();
      setDeleteCategory(null);
      
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (category: BrandCategory) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('brand_categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);

      if (error) throw error;
      await refetch();
      
      toast({
        title: "Sucesso",
        description: `Categoria ${!category.is_active ? 'ativada' : 'desativada'} com sucesso!`,
      });
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da categoria.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Gerenciar Categorias</h2>
          <p className="text-neutral-600">Gerencie as categorias de marcas da sua loja</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Nova Categoria</span>
        </Button>
      </div>

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-lg transition-all duration-300 ${!category.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                {/* Imagem da Categoria */}
                <div className="aspect-video bg-neutral-100 rounded-lg mb-4 overflow-hidden">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = 
                          '<div class="w-full h-full flex items-center justify-center text-neutral-400"><div class="text-center"><svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg><p class="text-sm">Imagem não encontrada</p></div></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <div className="text-center">
                        <Image size={48} className="mx-auto mb-2" />
                        <p className="text-sm">Sem imagem</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informações da Categoria */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg truncate">{category.name}</h3>
                    <div className="flex items-center space-x-2">
                      <GripVertical size={16} className="text-neutral-400" />
                      {category.is_active ? (
                        <Eye size={16} className="text-green-600" />
                      ) : (
                        <EyeOff size={16} className="text-red-600" />
                      )}
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-neutral-600 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {category.products_count || 0} produtos
                    </Badge>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(category)}
                      className="flex-1 text-xs"
                    >
                      {category.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span className="ml-1">{category.is_active ? 'Desativar' : 'Ativar'}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(category)}
                      className="flex-1 text-xs"
                    >
                      <Edit size={14} />
                      <span className="ml-1">Editar</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteCategory(category)}
                      disabled={category.products_count > 0}
                      title={category.products_count > 0 ? 'Não é possível excluir categoria com produtos' : 'Excluir categoria'}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-neutral-400 mb-4">
            <Image size={64} className="mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-neutral-600 mb-4">Comece criando sua primeira categoria de produtos.</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-2" />
            Criar Primeira Categoria
          </Button>
        </div>
      )}

      {/* Dialog do Formulário */}
      <Dialog open={showForm} onOpenChange={(open) => !open && (setShowForm(false), resetForm())}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Categoria *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Ex: Rolex, Cartier, Omega..."
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Categoria Ativa</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Descreva a categoria..."
              />
            </div>

            <div>
              <Label>Imagem da Categoria</Label>
              <CategoryImageUpload
                imageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                onImageRemoved={() => setFormData(prev => ({ ...prev, image_url: '' }))}
              />
            </div>

            <div className="flex space-x-4 pt-2">
              <Button type="submit" disabled={formLoading} className="flex-1">
                {formLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  editingCategory ? 'Atualizar Categoria' : 'Criar Categoria'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => (setShowForm(false), resetForm())}
                disabled={formLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria <strong>"{deleteCategory?.name}"</strong>?
              {deleteCategory?.products_count && deleteCategory.products_count > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  ⚠️ Esta categoria possui {deleteCategory.products_count} produto(s) vinculado(s).
                  Você deve remover todos os produtos antes de excluir a categoria.
                </span>
              )}
              {(!deleteCategory?.products_count || deleteCategory.products_count === 0) && (
                <span className="block mt-2 text-neutral-600">
                  Esta ação não pode ser desfeita.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCategory?.products_count && deleteCategory.products_count > 0}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {deleteCategory?.products_count && deleteCategory.products_count > 0 
                ? 'Não é possível excluir' 
                : 'Confirmar Exclusão'
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManager;
