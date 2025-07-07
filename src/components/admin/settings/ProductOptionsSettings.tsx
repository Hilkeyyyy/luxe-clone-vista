
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Truck, Award } from 'lucide-react';

interface ProductOptions {
  warranty_enabled: boolean;
  warranty_info: string;
  delivery_enabled: boolean;
  delivery_info: string;
  quality_enabled: boolean;
  quality_info: string;
}

const ProductOptionsSettings = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<ProductOptions>({
    warranty_enabled: true,
    warranty_info: 'Garantia de 12 meses contra defeitos de fabricação',
    delivery_enabled: true,
    delivery_info: 'Entrega em até 7 dias úteis para todo o Brasil',
    quality_enabled: true,
    quality_info: 'Produtos testados e com certificado de qualidade'
  });

  // Verificar se é admin
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadOptions();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const loadOptions = async () => {
    if (!isAdmin) {
      console.log('❌ Usuário não é admin, não carregando configurações');
      setLoading(false);
      return;
    }

    try {
      console.log('📋 Carregando configurações de opções do produto...');
      
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'warranty_enabled', 'warranty_info',
          'delivery_enabled', 'delivery_info', 
          'quality_enabled', 'quality_info'
        ]);

      if (error) {
        console.error('❌ Erro ao carregar opções:', error);
        throw error;
      }

      console.log('✅ Configurações carregadas:', data?.length || 0);
      
      const loadedOptions = { ...options };
      data?.forEach(item => {
        const key = item.setting_key as keyof ProductOptions;
        if (key in loadedOptions) {
          if (key.includes('_enabled')) {
            (loadedOptions as any)[key] = Boolean(item.setting_value);
          } else {
            // Limpar aspas duplas extras
            const value = String(item.setting_value || '').replace(/^"|"$/g, '');
            (loadedOptions as any)[key] = value;
          }
        }
      });

      setOptions(loadedOptions);
    } catch (error) {
      console.error('❌ Erro ao carregar opções:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações de opções do produto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveOptions = async () => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem salvar configurações.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      console.log('💾 Salvando configurações de opções...');
      
      const settingsToSave = Object.entries(options).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert(setting, { 
            onConflict: 'setting_key',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error('❌ Erro ao salvar configuração:', setting.setting_key, error);
          throw error;
        }
      }

      console.log('✅ Todas as configurações salvas com sucesso');
      toast({
        title: "Sucesso",
        description: "Configurações de opções salvas com sucesso!",
      });
    } catch (error) {
      console.error('❌ Erro ao salvar opções:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações de opções.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateOption = <K extends keyof ProductOptions>(
    key: K, 
    value: ProductOptions[K]
  ) => {
    console.log(`📝 Atualizando ${key}:`, value);
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-neutral-600">Faça login para acessar as configurações.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-neutral-600">Apenas administradores podem acessar esta seção.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Opções do Produto</h2>
          <p className="text-neutral-600">Configure as informações opcionais exibidas nos produtos</p>
        </div>
        <Button onClick={saveOptions} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>

      {/* Garantia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Garantia</span>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="warranty-switch">Ativado</Label>
              <Switch
                id="warranty-switch"
                checked={options.warranty_enabled}
                onCheckedChange={(checked) => updateOption('warranty_enabled', checked)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="warranty_info">Informações de Garantia</Label>
            <Textarea
              id="warranty_info"
              value={options.warranty_info}
              onChange={(e) => updateOption('warranty_info', e.target.value)}
              placeholder="Digite as informações de garantia..."
              className="mt-1"
              disabled={!options.warranty_enabled}
            />
          </div>
          <p className="text-sm text-neutral-500">
            {options.warranty_enabled 
              ? 'Esta informação será exibida nos detalhes do produto'
              : 'Desabilitado - não será exibido nos produtos'
            }
          </p>
        </CardContent>
      </Card>

      {/* Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-600" />
              <span>Entrega</span>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="delivery-switch">Ativado</Label>
              <Switch
                id="delivery-switch"
                checked={options.delivery_enabled}
                onCheckedChange={(checked) => updateOption('delivery_enabled', checked)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="delivery_info">Informações de Entrega</Label>
            <Textarea
              id="delivery_info"
              value={options.delivery_info}
              onChange={(e) => updateOption('delivery_info', e.target.value)}
              placeholder="Digite as informações de entrega..."
              className="mt-1"
              disabled={!options.delivery_enabled}
            />
          </div>
          <p className="text-sm text-neutral-500">
            {options.delivery_enabled 
              ? 'Esta informação será exibida nos detalhes do produto'
              : 'Desabilitado - não será exibido nos produtos'
            }
          </p>
        </CardContent>
      </Card>

      {/* Qualidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span>Qualidade</span>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="quality-switch">Ativado</Label>
              <Switch
                id="quality-switch"
                checked={options.quality_enabled}
                onCheckedChange={(checked) => updateOption('quality_enabled', checked)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quality_info">Informações de Qualidade</Label>
            <Textarea
              id="quality_info"
              value={options.quality_info}
              onChange={(e) => updateOption('quality_info', e.target.value)}
              placeholder="Digite as informações de qualidade..."
              className="mt-1"
              disabled={!options.quality_enabled}
            />
          </div>
          <p className="text-sm text-neutral-500">
            {options.quality_enabled 
              ? 'Esta informação será exibida nos detalhes do produto'
              : 'Desabilitado - não será exibido nos produtos'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductOptionsSettings;
