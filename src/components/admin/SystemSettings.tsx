
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Phone, Building, Settings, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Componentes das seções
import WhatsAppSettings from './settings/WhatsAppSettings';
import CompanySettings from './settings/CompanySettings';
import GeneralSettings from './settings/GeneralSettings';
import EmailSettings from './settings/EmailSettings';

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
        const key = item.setting_key as keyof SystemSettings;
        if (key in loadedSettings) {
          // Converter o valor Json para o tipo correto
          const value = item.setting_value;
          
          // Para campos booleanos
          if (key === 'whatsapp_enabled' || key === 'email_notifications_enabled') {
            loadedSettings[key] = Boolean(value);
          }
          // Para campos numéricos
          else if (key === 'free_shipping_minimum' || key === 'shipping_cost' || key === 'smtp_port') {
            loadedSettings[key] = Number(value) || 0;
          }
          // Para campos string
          else {
            loadedSettings[key] = String(value || '');
          }
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
            <WhatsAppSettings settings={settings} updateSetting={updateSetting} />
          </motion.div>
        </TabsContent>

        {/* Empresa */}
        <TabsContent value="company">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CompanySettings settings={settings} updateSetting={updateSetting} />
          </motion.div>
        </TabsContent>

        {/* Configurações Gerais */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GeneralSettings settings={settings} updateSetting={updateSetting} />
          </motion.div>
        </TabsContent>

        {/* E-mail */}
        <TabsContent value="email">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EmailSettings settings={settings} updateSetting={updateSetting} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
