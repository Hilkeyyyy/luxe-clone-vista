
import React, { useState } from 'react';
import { Upload, X, Loader, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();

  // Verificar se é admin pelos UIDs específicos
  const isAdmin = user && (
    user.id === '589069fc-fb82-4388-a802-40d373950011' ||
    user.id === '0fef94be-d716-4b9c-8053-e351a66927dc'
  );

  const uploadImage = async (file: File) => {
    console.log('🔄 UPLOAD CATEGORIA: Iniciando...', {
      fileName: file.name,
      fileSize: file.size,
      userId: user?.id?.substring(0, 8),
      isAdmin
    });
    
    if (!file) {
      console.error('❌ Nenhum arquivo fornecido');
      return;
    }

    // Verificar se usuário está autenticado e é admin
    if (!user || !isAdmin) {
      console.error('❌ Usuário não é admin:', { user: !!user, isAdmin });
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado como administrador para fazer upload de imagens.",
        variant: "destructive",
      });
      return;
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      console.error('❌ Tipo de arquivo inválido:', file.type);
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas imagens.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('❌ Arquivo muito grande:', file.size);
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      console.log('📤 Fazendo upload para Supabase storage...');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      console.log('📁 Caminho do arquivo:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('brand-category-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload concluído:', uploadData);

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('brand-category-images')
        .getPublicUrl(filePath);

      console.log('🔗 URL pública gerada:', urlData.publicUrl);

      onImageUploaded(urlData.publicUrl);
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error: any) {
      console.error('❌ Erro completo no upload:', error);
      
      let errorMessage = "Erro ao enviar imagem. Tente novamente.";
      
      if (error.message?.includes('Permission')) {
        errorMessage = "Sem permissão para fazer upload. Verifique se você é administrador.";
      } else if (error.message?.includes('Network')) {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      } else if (error.message?.includes('Storage')) {
        errorMessage = "Erro no armazenamento. Tente novamente em alguns instantes.";
      }
      
      toast({
        title: "Erro no Upload",
        description: errorMessage,
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

    console.log('🗑️ Removendo imagem:', imageUrl);

    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `categories/${fileName}`;

      console.log('📁 Removendo arquivo:', filePath);

      const { error } = await supabase.storage
        .from('brand-category-images')
        .remove([filePath]);

      if (error) {
        console.error('❌ Erro ao remover:', error);
        throw error;
      }

      console.log('✅ Imagem removida com sucesso');
      onImageRemoved();
      
      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso!",
      });
    } catch (error: any) {
      console.error('❌ Erro ao remover imagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem.",
        variant: "destructive",
      });
    }
  };

  // Mostrar aviso se usuário não for admin
  if (!user || !isAdmin) {
    return (
      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
        <div className="text-red-500 space-y-2">
          <Image className="w-12 h-12 mx-auto" />
          <p className="font-medium">Acesso Restrito</p>
          <p className="text-sm">Apenas administradores podem fazer upload de imagens.</p>
          <p className="text-xs text-neutral-500">
            ID atual: {user?.id?.substring(0, 8) || 'não logado'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
            onError={(e) => {
              console.error('❌ Erro ao carregar imagem:', imageUrl);
              e.currentTarget.style.display = 'none';
            }}
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
              <p className="text-xs text-green-600">
                ✅ Admin reconhecido: {user.id.substring(0, 8)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryImageUpload;
