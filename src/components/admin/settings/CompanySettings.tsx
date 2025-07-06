
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SystemSettings {
  company_name: string;
  company_phone: string;
  company_email: string;
  instagram_url: string;
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
              placeholder="(19) 99941-3755"
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
            <Label htmlFor="instagram_url">Instagram URL</Label>
            <Input
              id="instagram_url"
              placeholder="https://www.instagram.com/velar.watches/"
              value={settings.instagram_url}
              onChange={(e) => updateSetting('instagram_url', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySettings;
