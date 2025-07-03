
import React, { useState } from 'react';
import { Upload, X, Loader, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CategoryImageUploadProps {
  imageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

const CategoryImageUpload: React.FC<CategoryImageUploadProps> = ({
  imageUrl,
  onImageUploaded,
  onImageRemoved
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas imagens.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-category-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('brand-category-images')
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = async () => {
    if (!imageUrl) return;

    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `categories/${fileName}`;

      const { error } = await supabase.storage
        .from('brand-category-images')
        .remove([filePath]);

      if (error) throw error;

      onImageRemoved();
      
      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-neutral-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="space-y-2">
              <Loader className="w-8 h-8 animate-spin mx-auto text-neutral-500" />
              <p className="text-neutral-600">Enviando imagem...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Image className="w-12 h-12 mx-auto text-neutral-400" />
              <div>
                <p className="text-neutral-600 mb-2">
                  Arraste uma imagem aqui ou clique para selecionar
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    <Upload size={16} className="mr-2" />
                    Selecionar Imagem
                  </Button>
                </label>
              </div>
              <p className="text-xs text-neutral-500">
                PNG, JPG ou WEBP até 5MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryImageUpload;
