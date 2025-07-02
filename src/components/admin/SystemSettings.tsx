
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Phone, Building, Settings, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  // WhatsApp
  whatsapp_number: string;
  whatsapp_message_template: string;
  whatsapp_business_hours: string;
  whatsapp_enabled: boolean;
  
  // Empresa
  company_name: string;
  company_logo_url: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_instagram: string;
  company_facebook: string;
  company_website: string;
  
  // Configurações Gerais
  currency: string;
  free_shipping_minimum: number;
  shipping_cost: number;
  return_policy: string;
  terms_of_service: string;
  privacy_policy: string;
  
  // E-mail
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  email_notifications_enabled: boolean;
}

const SystemSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState<SystemSettings>({
    // WhatsApp
    whatsapp_number: '',
    whatsapp_message_template: 'Olá! Tenho interesse neste produto: {product_name} - {product_url}',
    whatsapp_business_hours: '08:00 - 18:00',
    whatsapp_enabled: true,
    
    // Empresa
    company_name: '',
    company_logo_url: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    company_instagram: '',
    company_facebook: '',
    company_website: '',
    
    // Configurações Gerais
    currency: 'BRL',
    free_shipping_minimum: 200,
    shipping_cost: 15,
    return_policy: '',
    terms_of_service: '',
    privacy_policy: '',
    
    // E-mail
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: '',
    email_notifications_enabled: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const loadedSettings = { ...settings };
      
      data?.forEach(item => {
        if (item.setting_key in loadedSettings) {
          loadedSettings[item.setting_key as keyof SystemSettings] = item.setting_value;
        }
      });

      setSettings(loadedSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações do sistema.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Preparar dados para salvar
      const settingsToSave = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      // Usar upsert para inserir ou atualizar
      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert(setting, { 
            onConflict: 'setting_key',
            ignoreDuplicates: false 
          });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof SystemSettings>(
    key: K, 
    value: SystemSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Configurações do Sistema</h2>
          <p className="text-neutral-600">Configure as opções gerais da sua loja</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="flex items-center space-x-2">
          <Save size={20} />
          <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
        </Button>
      </div>

      <Tabs defaultValue="whatsapp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
            <Phone size={16} />
            <span>WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building size={16} />
            <span>Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings size={16} />
            <span>Geral</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail size={16} />
            <span>E-mail</span>
          </TabsTrigger>
        </TabsList>

        {/* WhatsApp */}
        <TabsContent value="whatsapp">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
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
          </motion.div>
        </TabsContent>

        {/* Empresa */}
        <TabsContent value="company">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
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
          </motion.div>
        </TabsContent>

        {/* Configurações Gerais */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
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
          </motion.div>
        </TabsContent>

        {/* E-mail */}
        <TabsContent value="email">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
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
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
