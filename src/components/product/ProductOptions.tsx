
import React, { useState, useEffect } from 'react';
import { Shield, Truck, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface ProductOption {
  enabled: boolean;
  info: string;
}

interface ProductOptionsData {
  warranty: ProductOption;
  delivery: ProductOption;
  quality: ProductOption;
}

const ProductOptions = () => {
  const [options, setOptions] = useState<ProductOptionsData>({
    warranty: { enabled: true, info: '' },
    delivery: { enabled: true, info: '' },
    quality: { enabled: true, info: '' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'warranty_enabled', 'warranty_info',
          'delivery_enabled', 'delivery_info',
          'quality_enabled', 'quality_info'
        ]);

      if (error) throw error;

      const loadedOptions = { ...options };
      data?.forEach(item => {
        const [type, field] = item.setting_key.split('_');
        if (field === 'enabled') {
          (loadedOptions as any)[type][field] = Boolean(item.setting_value);
        } else if (field === 'info') {
          (loadedOptions as any)[type][field] = String(item.setting_value || '').replace(/^"|"$/g, '');
        }
      });

      setOptions(loadedOptions);
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-neutral-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const optionConfigs = [
    {
      key: 'warranty',
      icon: Shield,
      title: 'Garantia',
      data: options.warranty,
      color: 'text-blue-600'
    },
    {
      key: 'delivery',
      icon: Truck,
      title: 'Entrega',
      data: options.delivery,
      color: 'text-green-600'
    },
    {
      key: 'quality',
      icon: Award,
      title: 'Qualidade',
      data: options.quality,
      color: 'text-purple-600'
    }
  ];

  const enabledOptions = optionConfigs.filter(option => 
    option.data.enabled && option.data.info.trim()
  );

  if (enabledOptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Informações Adicionais</h3>
      {enabledOptions.map((option, index) => (
        <motion.div
          key={option.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
        >
          <option.icon className={`${option.color} mt-0.5 flex-shrink-0`} size={20} />
          <div>
            <h4 className="font-medium text-neutral-900 mb-1">{option.title}</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">{option.data.info}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductOptions;
