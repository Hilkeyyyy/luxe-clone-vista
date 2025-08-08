import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { enhancedSecureApiClient } from '@/utils/enhancedSecureApiClient';

interface InstagramSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
}

const InstagramSettings: React.FC<InstagramSettingsProps> = ({ settings, updateSetting }) => {
  const [uploading, setUploading] = useState(false);
  const images: string[] = Array.isArray(settings.instagram_images) ? settings.instagram_images : [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `post-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('instagram-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: pub } = await supabase.storage.from('instagram-images').getPublicUrl(data.path);
      const updated = [...images, pub.publicUrl];
      updateSetting('instagram_images', updated);
      await enhancedSecureApiClient.secureAdminSettingsUpdate({ instagram_images: updated });
      toast.success('Imagem adicionada ao carrossel');
    } catch (err) {
      console.error(err);
      toast.error('Falha no upload');
    } finally {
      setUploading(false);
      (e.target as HTMLInputElement).value = '';
    }
  };

  const removeAt = async (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    updateSetting('instagram_images', updated);
    await enhancedSecureApiClient.secureAdminSettingsUpdate({ instagram_images: updated });
    toast.success('Imagem removida');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instagram</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          <Button disabled={uploading} onClick={() => document.querySelector<HTMLInputElement>('#insta-file')?.click()} className="hidden">Enviar</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <div key={i} className="relative group border rounded-lg overflow-hidden">
              <img src={src} alt={`Instagram ${i + 1}`} className="w-full h-40 object-cover" />
              <button onClick={() => removeAt(i)} className="absolute top-2 right-2 text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Remover</button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstagramSettings;
