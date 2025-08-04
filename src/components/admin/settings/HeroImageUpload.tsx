import React, { useState } from 'react';
import { Upload, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface HeroImageUploadProps {
  backgroundImage: string;
  onImageChange: (imageUrl: string) => void;
}

const HeroImageUpload: React.FC<HeroImageUploadProps> = ({
  backgroundImage,
  onImageChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato de arquivo não suportado. Use JPG, PNG ou WebP.');
      return;
    }

    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Tamanho máximo: 5MB.');
      return;
    }

    setUploading(true);
    
    try {
      const fileName = `hero-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(data.path);

      onImageChange(publicUrl);
      toast.success('Imagem do hero enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      toast.error('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onImageChange('');
    toast.success('Imagem removida');
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="hero-image-upload" className="text-sm font-medium">
        Imagem de Fundo do Hero
      </Label>
      
      {backgroundImage ? (
        <div className="space-y-3">
          {/* Preview da imagem atual */}
          <div className="relative">
            <div 
              className="w-full h-32 bg-cover bg-center rounded-lg border-2 border-dashed border-neutral-300 relative overflow-hidden"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewVisible(true)}
                  className="bg-white/90 hover:bg-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('hero-image-upload')?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Trocar Imagem
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">
            Clique para enviar uma imagem de fundo para o hero
          </p>
          <p className="text-sm text-neutral-400 mb-4">
            Formatos suportados: JPG, PNG, WebP (máx. 5MB)
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('hero-image-upload')?.click()}
            disabled={uploading}
          >
            {uploading ? 'Enviando...' : 'Selecionar Imagem'}
          </Button>
        </div>
      )}

      {/* Input oculto para upload */}
      <Input
        id="hero-image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={uploading}
      />

      {/* Modal de preview */}
      {previewVisible && backgroundImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewVisible(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={backgroundImage} 
              alt="Preview da imagem do hero"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={() => setPreviewVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroImageUpload;