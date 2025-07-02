
import React from 'react';
import { Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface SystemSettings {
  whatsapp_number: string;
  whatsapp_message_template: string;
  whatsapp_business_hours: string;
  whatsapp_enabled: boolean;
}

interface WhatsAppSettingsProps {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
}

const WhatsAppSettings = ({ settings, updateSetting }: WhatsAppSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="text-green-600" />
          <span>Configurações do WhatsApp</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Ativar WhatsApp</Label>
            <p className="text-sm text-neutral-600">Habilitar integração com WhatsApp</p>
          </div>
          <Switch
            checked={settings.whatsapp_enabled}
            onCheckedChange={(checked) => updateSetting('whatsapp_enabled', checked)}
          />
        </div>

        <div>
          <Label htmlFor="whatsapp_number">Número do WhatsApp</Label>
          <Input
            id="whatsapp_number"
            placeholder="Ex: 5511999999999"
            value={settings.whatsapp_number}
            onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Formato: Código do país + DDD + número (sem espaços ou caracteres especiais)
          </p>
        </div>

        <div>
          <Label htmlFor="whatsapp_message_template">Mensagem Padrão</Label>
          <Textarea
            id="whatsapp_message_template"
            value={settings.whatsapp_message_template}
            onChange={(e) => updateSetting('whatsapp_message_template', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Use {'{product_name}'} e {'{product_url}'} para inserir dados do produto automaticamente
          </p>
        </div>

        <div>
          <Label htmlFor="whatsapp_business_hours">Horário de Funcionamento</Label>
          <Input
            id="whatsapp_business_hours"
            placeholder="Ex: 08:00 - 18:00"
            value={settings.whatsapp_business_hours}
            onChange={(e) => updateSetting('whatsapp_business_hours', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
