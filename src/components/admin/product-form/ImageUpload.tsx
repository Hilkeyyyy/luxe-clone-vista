
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImagesChange }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Erro",
            description: "Apenas imagens são permitidas",
            variant: "destructive"
          });
          continue;
        }

        // Validar tamanho (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Erro",
            description: "Imagem muito grande. Máximo 5MB.",
            variant: "destructive"
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) {
          console.error('Erro no upload:', error);
          toast({
            title: "Erro",
            description: "Erro ao fazer upload da imagem",
            variant: "destructive"
          });
          continue;
        }

        // Obter URL pública
        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicData.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
        toast({
          title: "Sucesso",
          description: `${uploadedUrls.length} imagem(ns) enviada(s)`,
        });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload das imagens",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    try {
      // Extrair o nome do arquivo da URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Tentar deletar do storage
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (error) {
        console.error('Erro ao deletar imagem:', error);
      }

      // Remover da lista de imagens
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);

      toast({
        title: "Sucesso",
        description: "Imagem removida",
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon size={20} />
          <span>Imagens do Produto *</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload size={40} className="text-neutral-400" />
            <div>
              <p className="text-sm font-medium">
                {uploading ? 'Enviando...' : 'Clique para fazer upload das imagens'}
              </p>
              <p className="text-xs text-neutral-500">
                Aceita múltiplas imagens • Máximo 5MB cada
              </p>
            </div>
          </label>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Produto ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image, index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <p className="text-sm text-neutral-500 text-center">
            Nenhuma imagem adicionada. Adicione pelo menos uma imagem.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
