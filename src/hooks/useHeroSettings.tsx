import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeroSettings {
  title: string;
  subtitle: string;
  backgroundImage: string;
  buttonPrimaryText: string;
  buttonSecondaryText: string;
  overlayOpacity: string;
  textPosition: string;
}

export const useHeroSettings = () => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    title: 'RELÓGIOS PREMIUM E COM QUALIDADE',
    subtitle: '',
    backgroundImage: '',
    buttonPrimaryText: 'Explorar Coleção',
    buttonSecondaryText: 'Ver Destaques',
    overlayOpacity: '0.7',
    textPosition: 'center'
  });
  const [loading, setLoading] = useState(true);

  const fetchHeroSettings = async () => {
    try {
      const settingsKeys = [
        'hero_title',
        'hero_subtitle', 
        'hero_background_image',
        'hero_button_primary_text',
        'hero_button_secondary_text',
        'hero_overlay_opacity',
        'hero_text_position'
      ];

      const { data: settingsData } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', settingsKeys);

      const settings: { [key: string]: string } = {};
      settingsData?.forEach(item => {
        const value = (item.setting_value as any)?.value || item.setting_value as string;
        settings[item.setting_key] = value || '';
      });

      setHeroSettings({
        title: settings.hero_title || 'RELÓGIOS PREMIUM E COM QUALIDADE',
        subtitle: settings.hero_subtitle || '',
        backgroundImage: settings.hero_background_image || '',
        buttonPrimaryText: settings.hero_button_primary_text || 'Explorar Coleção',
        buttonSecondaryText: settings.hero_button_secondary_text || 'Ver Destaques',
        overlayOpacity: settings.hero_overlay_opacity || '0.7',
        textPosition: settings.hero_text_position || 'center'
      });
    } catch (error) {
      console.error('Erro ao buscar configurações do hero:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  return {
    heroSettings,
    loading,
    refetch: fetchHeroSettings
  };
};