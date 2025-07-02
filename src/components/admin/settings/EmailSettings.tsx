
import React from 'react';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SystemSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  email_notifications_enabled: boolean;
}

interface EmailSettingsProps {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
}

const EmailSettings = ({ settings, updateSetting }: EmailSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="text-red-600" />
          <span>Configurações de E-mail</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Ativar Notificações por E-mail</Label>
            <p className="text-sm text-neutral-600">Enviar notificações automáticas</p>
          </div>
          <Switch
            checked={settings.email_notifications_enabled}
            onCheckedChange={(checked) => updateSetting('email_notifications_enabled', checked)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="smtp_host">Servidor SMTP</Label>
            <Input
              id="smtp_host"
              placeholder="smtp.gmail.com"
              value={settings.smtp_host}
              onChange={(e) => updateSetting('smtp_host', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="smtp_port">Porta SMTP</Label>
            <Input
              id="smtp_port"
              type="number"
              placeholder="587"
              value={settings.smtp_port}
              onChange={(e) => updateSetting('smtp_port', parseInt(e.target.value) || 587)}
            />
          </div>

          <div>
            <Label htmlFor="smtp_user">Usuário SMTP</Label>
            <Input
              id="smtp_user"
              placeholder="seu@email.com"
              value={settings.smtp_user}
              onChange={(e) => updateSetting('smtp_user', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="smtp_password">Senha SMTP</Label>
            <Input
              id="smtp_password"
              type="password"
              value={settings.smtp_password}
              onChange={(e) => updateSetting('smtp_password', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="smtp_from_email">E-mail de Envio</Label>
            <Input
              id="smtp_from_email"
              placeholder="noreply@suaempresa.com"
              value={settings.smtp_from_email}
              onChange={(e) => updateSetting('smtp_from_email', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="smtp_from_name">Nome do Remetente</Label>
            <Input
              id="smtp_from_name"
              placeholder="Sua Empresa"
              value={settings.smtp_from_name}
              onChange={(e) => updateSetting('smtp_from_name', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
