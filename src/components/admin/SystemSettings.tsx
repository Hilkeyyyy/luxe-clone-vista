import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Phone, Building, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { enhancedSecureApiClient } from '@/utils/enhancedSecureApiClient';
import { sanitizeInput } from '@/utils/securityEnhancements';
import { enhancedCsrfManager } from '@/utils/enhancedCsrfProtection';
import { supabase } from '@/integrations/supabase/client';

// Componentes das seções
import WhatsAppSettings from './settings/WhatsAppSettings';
import CompanySettings from './settings/CompanySettings';
import ProductOptionsSettings from './settings/ProductOptionsSettings';

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
}

const SystemSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState<SystemSettings>({
    // WhatsApp
    whatsapp_number: '19999413755',
    whatsapp_message_template: '⏱️ Pedido de Produto\n\n• Nome do Produto: {product_name}\n• Quantidade: {quantity}\n• Preço Unitário: R$ {unit_price}\n• Total a Pagar: R$ {total_price}\n• Imagem do Produto: {product_image}\n\n🕒 Gerado em: {timestamp}\n\n📩 Mensagem:\nOlá! Gostei muito deste(s) produto(s) e tenho interesse em comprá-lo(s). Poderia me passar mais informações sobre pagamento, envio e disponibilidade?\n\nAguardo seu retorno. Obrigado(a)!',
    whatsapp_enabled: true,
    
    // Empresa
    company_name: 'VELAR WATCHES',
    company_phone: '(19) 99941-3755',
    company_email: 'contato@velarwatches.com',
    instagram_url: 'https://www.instagram.com/velar.watches/',
  });

  useEffect(() => {
    loadSettings();
    // Gerar token CSRF na inicialização
    enhancedCsrfManager.getToken();
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
          const value = item.setting_value;
          
          // For boolean fields
          if (key === 'whatsapp_enabled') {
            loadedSettings[key] = Boolean(value);
          }
          // For string fields - sanitize on load with enhanced security
          else {
            const stringValue = String(value || '').replace(/"/g, '');
            loadedSettings[key] = sanitizeInput(stringValue, { maxLength: 1000 });
          }
        }
      });

      setSettings(loadedSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro de Segurança",
        description: "Erro ao carregar configurações do sistema com segurança.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Usar cliente API seguro aprimorado
      await enhancedSecureApiClient.secureAdminSettingsUpdate(settings);

      toast({
        title: "Sucesso",
        description: "Configurações salvas com segurança!",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro de Segurança",
        description: error instanceof Error ? error.message : "Erro ao salvar configurações com segurança.",
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
    // Enhanced sanitization for string inputs
    const sanitizedValue = typeof value === 'string' ? 
      sanitizeInput(value, { maxLength: 1000 }) : value;
    
    setSettings(prev => ({ ...prev, [key]: sanitizedValue }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando configurações com segurança...</p>
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
          <p className="text-neutral-600">Configure as opções gerais da sua loja com segurança</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="flex items-center space-x-2">
          <Save size={20} />
          <span>{saving ? 'Salvando com Segurança...' : 'Salvar Configurações'}</span>
        </Button>
      </div>

      <Tabs defaultValue="whatsapp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
            <Phone size={16} />
            <span>WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building size={16} />
            <span>Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="product-options" className="flex items-center space-x-2">
            <Settings size={16} />
            <span>Opções do Produto</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <WhatsAppSettings settings={settings} updateSetting={updateSetting} />
          </motion.div>
        </TabsContent>

        <TabsContent value="company">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CompanySettings settings={settings} updateSetting={updateSetting} />
          </motion.div>
        </TabsContent>

        <TabsContent value="product-options">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductOptionsSettings />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
