
import React from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SystemSettings {
  currency: string;
  free_shipping_minimum: number;
  shipping_cost: number;
  return_policy: string;
  terms_of_service: string;
  privacy_policy: string;
}

interface GeneralSettingsProps {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
}

const GeneralSettings = ({ settings, updateSetting }: GeneralSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="text-purple-600" />
          <span>Configurações Gerais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="currency">Moeda</Label>
            <Input
              id="currency"
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              disabled
            />
            <p className="text-xs text-neutral-500 mt-1">Atualmente fixo em BRL</p>
          </div>

          <div>
            <Label htmlFor="free_shipping_minimum">Frete Grátis a partir de</Label>
            <Input
              id="free_shipping_minimum"
              type="number"
              step="0.01"
              value={settings.free_shipping_minimum}
              onChange={(e) => updateSetting('free_shipping_minimum', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label htmlFor="shipping_cost">Valor do Frete</Label>
            <Input
              id="shipping_cost"
              type="number"
              step="0.01"
              value={settings.shipping_cost}
              onChange={(e) => updateSetting('shipping_cost', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="return_policy">Política de Devolução</Label>
          <Textarea
            id="return_policy"
            value={settings.return_policy}
            onChange={(e) => updateSetting('return_policy', e.target.value)}
            rows={4}
            placeholder="Descreva sua política de devolução..."
          />
        </div>

        <div>
          <Label htmlFor="terms_of_service">Termos de Serviço</Label>
          <Textarea
            id="terms_of_service"
            value={settings.terms_of_service}
            onChange={(e) => updateSetting('terms_of_service', e.target.value)}
            rows={4}
            placeholder="Descreva os termos de serviço..."
          />
        </div>

        <div>
          <Label htmlFor="privacy_policy">Política de Privacidade</Label>
          <Textarea
            id="privacy_policy"
            value={settings.privacy_policy}
            onChange={(e) => updateSetting('privacy_policy', e.target.value)}
            rows={4}
            placeholder="Descreva a política de privacidade..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
