import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, Palette, Type, Layout, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import HeroImageUpload from './HeroImageUpload';

interface VisualHeroEditorProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onSave: () => Promise<void>;
}

const VisualHeroEditor: React.FC<VisualHeroEditorProps> = ({
  settings,
  updateSetting,
  onSave
}) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const textPositionOptions = [
    { value: 'left', label: 'Esquerda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Direita' }
  ];

  return (
    <div className="space-y-6">
      {/* Header com botões de ação */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Editor Visual do Hero</h3>
          <p className="text-sm text-muted-foreground">
            Edite todos os aspectos visuais da sua landing page
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Editar' : 'Preview'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Tudo'}
          </Button>
        </div>
      </div>

      {previewMode ? (
        /* Preview em tempo real */
        <Card className="overflow-hidden">
          <div 
            className="relative h-96 bg-cover bg-center flex items-center justify-center"
            style={{ 
              backgroundImage: settings.hero_background_image ? `url(${settings.hero_background_image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: parseFloat(settings.hero_overlay_opacity || '0.7') }}
            />
            <div 
              className={`relative z-10 text-white max-w-4xl px-6 ${
                settings.hero_text_position === 'left' ? 'text-left' : 
                settings.hero_text_position === 'right' ? 'text-right' : 'text-center'
              }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {settings.hero_title || 'SEU TÍTULO AQUI'}
              </h1>
              {settings.hero_subtitle && (
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {settings.hero_subtitle}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  {settings.hero_button_primary_text || 'Botão Principal'}
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  {settings.hero_button_secondary_text || 'Botão Secundário'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Interface de edição */
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Imagem
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Estilo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Textos do Hero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Título Principal</Label>
                  <Input
                    id="hero-title"
                    value={settings.hero_title || ''}
                    onChange={(e) => updateSetting('hero_title', e.target.value)}
                    placeholder="Digite o título principal"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle">Subtítulo (opcional)</Label>
                  <Input
                    id="hero-subtitle"
                    value={settings.hero_subtitle || ''}
                    onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
                    placeholder="Digite o subtítulo"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-primary-btn">Texto do Botão Principal</Label>
                  <Input
                    id="hero-primary-btn"
                    value={settings.hero_button_primary_text || ''}
                    onChange={(e) => updateSetting('hero_button_primary_text', e.target.value)}
                    placeholder="Ex: Explorar Coleção"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-secondary-btn">Texto do Botão Secundário</Label>
                  <Input
                    id="hero-secondary-btn"
                    value={settings.hero_button_secondary_text || ''}
                    onChange={(e) => updateSetting('hero_button_secondary_text', e.target.value)}
                    placeholder="Ex: Ver Destaques"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Imagem de Fundo</CardTitle>
              </CardHeader>
              <CardContent>
                <HeroImageUpload
                  backgroundImage={settings.hero_background_image || ''}
                  onImageChange={(imageUrl) => updateSetting('hero_background_image', imageUrl)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Posicionamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="text-position">Posição do Texto</Label>
                  <Select
                    value={settings.hero_text_position || 'center'}
                    onValueChange={(value) => updateSetting('hero_text_position', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {textPositionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estilo Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="overlay-opacity">
                    Opacidade do Overlay: {Math.round(parseFloat(settings.hero_overlay_opacity || '0.7') * 100)}%
                  </Label>
                  <Slider
                    id="overlay-opacity"
                    value={[parseFloat(settings.hero_overlay_opacity || '0.7') * 100]}
                    onValueChange={(value) => updateSetting('hero_overlay_opacity', (value[0] / 100).toString())}
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Controla a transparência da camada escura sobre a imagem
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Mini preview fixo no canto */}
      {!previewMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 w-64 h-32 bg-white shadow-lg rounded-lg overflow-hidden border z-50"
        >
          <div 
            className="relative h-full bg-cover bg-center flex items-center justify-center"
            style={{ 
              backgroundImage: settings.hero_background_image ? `url(${settings.hero_background_image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: parseFloat(settings.hero_overlay_opacity || '0.7') }}
            />
            <div className="relative z-10 text-white text-center px-2">
              <h4 className="text-xs font-bold truncate">
                {settings.hero_title || 'SEU TÍTULO'}
              </h4>
              <p className="text-xs opacity-75 truncate">
                Preview ao vivo
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VisualHeroEditor;