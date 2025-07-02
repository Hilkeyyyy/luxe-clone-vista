
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, MessageCircle, Globe, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminSettingsData {
  whatsapp_config: {
    number: string;
    business_hours: string;
  };
  site_config: {
    company_name: string;
    logo_url: string;
  };
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AdminSettingsData>({
    whatsapp_config: {
      number: '',
      business_hours: ''
    },
    site_config: {
      company_name: '',
      logo_url: ''
    }
  });

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      navigate('/admin');
      return;
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');

      if (error) throw error;

      const settingsData: AdminSettingsData = {
        whatsapp_config: {
          number: '',
          business_hours: ''
        },
        site_config: {
          company_name: '',
          logo_url: ''
        }
      };

      // Process settings data
      data?.forEach(setting => {
        if (setting.setting_key === 'whatsapp_config') {
          settingsData.whatsapp_config = setting.setting_value as any;
        } else if (setting.setting_key === 'site_config') {
          settingsData.site_config = setting.setting_value as any;
        }
      });

      setSettings(settingsData);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Update WhatsApp config
      const { error: whatsappError } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'whatsapp_config',
          setting_value: settings.whatsapp_config
        }, {
          onConflict: 'setting_key'
        });

      if (whatsappError) throw whatsappError;

      // Update site config
      const { error: siteError } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'site_config',
          setting_value: settings.site_config
        }, {
          onConflict: 'setting_key'
        });

      if (siteError) throw siteError;

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso.",
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

  const updateWhatsAppConfig = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      whatsapp_config: {
        ...prev.whatsapp_config,
        [field]: value
      }
    }));
  };

  const updateSiteConfig = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      site_config: {
        ...prev.site_config,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-outfit">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </button>
              <span className="text-neutral-500">|</span>
              <h1 className="text-2xl font-bold text-neutral-900">Configurações</h1>
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-neutral-900 hover:bg-neutral-800"
            >
              <Save size={20} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* WhatsApp Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="text-green-600" size={24} />
                  <span>Configurações do WhatsApp</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="whatsapp_number">Número do WhatsApp</Label>
                  <Input
                    id="whatsapp_number"
                    value={settings.whatsapp_config.number}
                    onChange={(e) => updateWhatsAppConfig('number', e.target.value)}
                    placeholder="5586988388124"
                    className="mt-2"
                  />
                  <p className="text-sm text-neutral-600 mt-2">
                    Digite o número no formato internacional (sem + ou espaços)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="business_hours">Horário de Funcionamento</Label>
                  <Input
                    id="business_hours"
                    value={settings.whatsapp_config.business_hours}
                    onChange={(e) => updateWhatsAppConfig('business_hours', e.target.value)}
                    placeholder="09:00-18:00"
                    className="mt-2"
                  />
                  <p className="text-sm text-neutral-600 mt-2">
                    Formato: HH:MM-HH:MM (ex: 09:00-18:00)
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Como funciona:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Os clientes podem adicionar produtos ao carrinho e favoritos</li>
                    <li>• Ao finalizar, uma mensagem pré-formatada é enviada via WhatsApp</li>
                    <li>• A mensagem contém detalhes dos produtos e valor total</li>
                    <li>• Você receberá o pedido diretamente no WhatsApp Business</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Site Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="text-blue-600" size={24} />
                  <span>Configurações do Site</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="company_name">Nome da Empresa</Label>
                  <Input
                    id="company_name"
                    value={settings.site_config.company_name}
                    onChange={(e) => updateSiteConfig('company_name', e.target.value)}
                    placeholder="Mega Clones"
                    className="mt-2"
                  />
                  <p className="text-sm text-neutral-600 mt-2">
                    Nome que aparecerá no cabeçalho e nas mensagens do WhatsApp
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="logo_url">URL do Logo</Label>
                  <Input
                    id="logo_url"
                    value={settings.site_config.logo_url}
                    onChange={(e) => updateSiteConfig('logo_url', e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                    className="mt-2"
                  />
                  <p className="text-sm text-neutral-600 mt-2">
                    URL da imagem do logo (opcional). Deixe em branco para usar o nome da empresa
                  </p>
                </div>

                {settings.site_config.logo_url && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Preview do Logo:</p>
                    <img
                      src={settings.site_config.logo_url}
                      alt="Logo preview"
                      className="max-h-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* System Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="text-neutral-600" size={24} />
                  <span>Informações do Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-800 mb-2">Versão do Sistema</h4>
                    <p className="text-neutral-600">v1.0.0</p>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-800 mb-2">Última Atualização</h4>
                    <p className="text-neutral-600">
                      {new Date().toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Funcionalidades Ativas:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✓ Catálogo de produtos com categorização automática</li>
                    <li>✓ Carrinho de compras e lista de favoritos</li>
                    <li>✓ Integração completa com WhatsApp Business</li>
                    <li>✓ Painel administrativo para gestão de produtos</li>
                    <li>✓ Configuração de carrosséis da landing page</li>
                    <li>✓ Sistema de autenticação para administradores</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
