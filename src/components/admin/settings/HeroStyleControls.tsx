import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface Props {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onAutoSave?: (key: string, value: any) => Promise<void> | void;
}

const HeroStyleControls: React.FC<Props> = ({ settings, updateSetting, onAutoSave }) => {
  const save = async (key: string, value: any) => {
    updateSetting(key, value);
    await onAutoSave?.(key, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estilo Avançado</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Tamanho do Título</Label>
          <Select value={settings.hero_title_size || 'lg'} onValueChange={(v) => save('hero_title_size', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="md">Médio</SelectItem>
              <SelectItem value="lg">Grande</SelectItem>
              <SelectItem value="xl">Extra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tamanho do Subtítulo</Label>
          <Select value={settings.hero_subtitle_size || 'md'} onValueChange={(v) => save('hero_subtitle_size', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Pequeno</SelectItem>
              <SelectItem value="md">Médio</SelectItem>
              <SelectItem value="lg">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Cor do Texto</Label>
          <Select value={settings.hero_text_color || 'foreground'} onValueChange={(v) => save('hero_text_color', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="foreground">Padrão</SelectItem>
              <SelectItem value="primary">Primária</SelectItem>
              <SelectItem value="muted-foreground">Suave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Espaçamento Vertical</Label>
          <Select value={settings.hero_padding || 'comfortable'} onValueChange={(v) => save('hero_padding', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compacto</SelectItem>
              <SelectItem value="comfortable">Confortável</SelectItem>
              <SelectItem value="roomy">Amplo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroStyleControls;
