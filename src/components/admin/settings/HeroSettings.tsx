import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import HeroImageUpload from './HeroImageUpload';

interface SystemSettings {
  // WhatsApp
  whatsapp_number: string;
  whatsapp_message_template: string;
  whatsapp_enabled: boolean;
  
  // Empresa
  company_name: string;
  company_phone: string;
  company_email: string;
  instagram_url: string;
  
  // Hero
  hero_title: string;
  hero_subtitle: string;
  hero_background_image: string;
  hero_button_primary_text: string;
  hero_button_secondary_text: string;
  hero_overlay_opacity: string;
  hero_text_position: string;
}

interface HeroSettingsProps {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
}

const HeroSettings: React.FC<HeroSettingsProps> = ({ settings, updateSetting }) => {
  const handleOpacityChange = (value: number[]) => {
    updateSetting('hero_overlay_opacity', value[0].toString());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎨 Configurações do Hero
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload de Imagem de Fundo */}
        <HeroImageUpload
          backgroundImage={settings.hero_background_image}
          onImageChange={(imageUrl) => updateSetting('hero_background_image', imageUrl)}
        />

        {/* Textos do Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Título Principal</Label>
            <Input
              id="hero-title"
              value={settings.hero_title}
              onChange={(e) => updateSetting('hero_title', e.target.value)}
              placeholder="Ex: RELÓGIOS PREMIUM E COM QUALIDADE"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtítulo (Opcional)</Label>
            <Input
              id="hero-subtitle"
              value={settings.hero_subtitle}
              onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
              placeholder="Ex: A melhor seleção de relógios"
            />
          </div>
        </div>

        {/* Textos dos Botões */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hero-btn-primary">Texto do Botão Principal</Label>
            <Input
              id="hero-btn-primary"
              value={settings.hero_button_primary_text}
              onChange={(e) => updateSetting('hero_button_primary_text', e.target.value)}
              placeholder="Ex: Explorar Coleção"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-btn-secondary">Texto do Botão Secundário</Label>
            <Input
              id="hero-btn-secondary"
              value={settings.hero_button_secondary_text}
              onChange={(e) => updateSetting('hero_button_secondary_text', e.target.value)}
              placeholder="Ex: Ver Destaques"
            />
          </div>
        </div>

        {/* Configurações de Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Posição do Texto */}
          <div className="space-y-3">
            <Label>Posição do Texto</Label>
            <Select
              value={settings.hero_text_position}
              onValueChange={(value) => updateSetting('hero_text_position', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar posição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transparência da Sobreposição */}
          <div className="space-y-3">
            <Label>
              Transparência da Sobreposição: {Math.round(parseFloat(settings.hero_overlay_opacity) * 100)}%
            </Label>
            <Slider
              value={[parseFloat(settings.hero_overlay_opacity)]}
              onValueChange={handleOpacityChange}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Transparente</span>
              <span>Opaco</span>
            </div>
          </div>
        </div>

        {/* Preview das Configurações */}
        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
          <h4 className="text-sm font-medium mb-3">Preview das Configurações:</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p><strong>Título:</strong> {settings.hero_title}</p>
            {settings.hero_subtitle && <p><strong>Subtítulo:</strong> {settings.hero_subtitle}</p>}
            <p><strong>Botão Principal:</strong> {settings.hero_button_primary_text}</p>
            <p><strong>Botão Secundário:</strong> {settings.hero_button_secondary_text}</p>
            <p><strong>Posição:</strong> {settings.hero_text_position === 'center' ? 'Centro' : settings.hero_text_position === 'left' ? 'Esquerda' : 'Direita'}</p>
            <p><strong>Opacidade:</strong> {Math.round(parseFloat(settings.hero_overlay_opacity) * 100)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSettings;