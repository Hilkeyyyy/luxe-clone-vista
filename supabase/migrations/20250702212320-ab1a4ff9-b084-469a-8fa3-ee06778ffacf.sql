
-- Adicionar coluna clone_category na tabela products
ALTER TABLE public.products 
ADD COLUMN clone_category TEXT DEFAULT 'Clone' CHECK (clone_category IN ('ETA Base', 'Clone', 'Super Clone'));

-- Atualizar produtos existentes com categorias baseadas no preço (exemplo)
UPDATE public.products 
SET clone_category = CASE 
  WHEN price >= 5000 THEN 'Super Clone'
  WHEN price >= 2000 THEN 'Clone'
  ELSE 'ETA Base'
END;

-- Criar tabela para configurações do admin
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configurações padrão
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
('whatsapp_config', '{"number": "5586988388124", "business_hours": "09:00-18:00"}'),
('site_config', '{"company_name": "Mega Clones", "logo_url": ""}');

-- RLS para admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view admin settings" 
  ON public.admin_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage admin settings" 
  ON public.admin_settings 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));
