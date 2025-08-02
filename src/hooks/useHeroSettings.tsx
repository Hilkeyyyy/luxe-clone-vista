import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeroSettings {
  title: string;
  backgroundImage: string;
}

export const useHeroSettings = () => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    title: 'RELÓGIOS PREMIUM E COM QUALIDADE',
    backgroundImage: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchHeroSettings = async () => {
    try {
      const { data: titleData } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_title')
        .single();

      const { data: bgData } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_background_image')
        .single();

      setHeroSettings({
        title: (titleData?.setting_value as any)?.value || titleData?.setting_value as string || 'RELÓGIOS PREMIUM E COM QUALIDADE',
        backgroundImage: (bgData?.setting_value as any)?.value || bgData?.setting_value as string || ''
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