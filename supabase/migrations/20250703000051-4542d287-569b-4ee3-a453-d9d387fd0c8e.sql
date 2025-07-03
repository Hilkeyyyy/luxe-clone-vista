
-- Criar função security definer para verificar role do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Remover políticas problemáticas que causam recursão
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can manage admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Only admins can manage brand categories" ON public.brand_categories;
DROP POLICY IF EXISTS "Only admins can manage carousel config" ON public.carousel_config;
DROP POLICY IF EXISTS "Only admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Only admins can update products" ON public.products;
DROP POLICY IF EXISTS "Only admins can delete products" ON public.products;

-- Recriar políticas usando a função security definer
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can manage admin settings" ON public.admin_settings
FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can manage brand categories" ON public.brand_categories
FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can manage carousel config" ON public.carousel_config
FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can insert products" ON public.products
FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can update products" ON public.products
FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can delete products" ON public.products
FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Atualizar configurações do administrador para usar variáveis de ambiente
UPDATE public.admin_settings 
SET setting_value = jsonb_build_object(
  'admin_uid', 'ENVIRONMENT_VARIABLE',
  'whatsapp_number', '5586988388124'
)
WHERE setting_key = 'admin_config';
