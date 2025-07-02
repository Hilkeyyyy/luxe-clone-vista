
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SystemSettings {
  company_name: string;
  company_logo_url: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_instagram: string;
  company_facebook: string;
  company_website: string;
}

interface CompanySettingsProps {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
}

const CompanySettings = ({ settings, updateSetting }: CompanySettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="text-blue-600" />
          <span>Dados da Empresa</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company_name">Nome da Empresa</Label>
            <Input
              id="company_name"
              value={settings.company_name}
              onChange={(e) => updateSetting('company_name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="company_phone">Telefone</Label>
            <Input
              id="company_phone"
              placeholder="(11) 99999-9999"
              value={settings.company_phone}
              onChange={(e) => updateSetting('company_phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="company_email">E-mail</Label>
            <Input
              id="company_email"
              type="email"
              value={settings.company_email}
              onChange={(e) => updateSetting('company_email', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="company_website">Website</Label>
            <Input
              id="company_website"
              placeholder="https://www.exemplo.com"
              value={settings.company_website}
              onChange={(e) => updateSetting('company_website', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="company_address">Endereço Completo</Label>
          <Textarea
            id="company_address"
            value={settings.company_address}
            onChange={(e) => updateSetting('company_address', e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="company_logo_url">URL do Logo</Label>
          <Input
            id="company_logo_url"
            type="url"
            placeholder="https://exemplo.com/logo.png"
            value={settings.company_logo_url}
            onChange={(e) => updateSetting('company_logo_url', e.target.value)}
          />
          {settings.company_logo_url && (
            <div className="mt-2">
              <img
                src={settings.company_logo_url}
                alt="Logo Preview"
                className="w-32 h-20 object-contain rounded border"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company_instagram">Instagram</Label>
            <Input
              id="company_instagram"
              placeholder="@suaempresa"
              value={settings.company_instagram}
              onChange={(e) => updateSetting('company_instagram', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="company_facebook">Facebook</Label>
            <Input
              id="company_facebook"
              placeholder="facebook.com/suaempresa"
              value={settings.company_facebook}
              onChange={(e) => updateSetting('company_facebook', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySettings;
