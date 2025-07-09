
-- FASE 1: Correções Críticas de Políticas RLS

-- 1. Limpar políticas conflitantes em admin_settings
DROP POLICY IF EXISTS "Public can view basic settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admins can manage whatsapp settings" ON public.admin_settings;

-- 2. Recriar política pública mais restritiva (apenas informações básicas da empresa)
CREATE POLICY "Public can view company info only" ON public.admin_settings
FOR SELECT USING (
  setting_key IN ('company_name', 'company_phone', 'company_email', 'instagram_url')
);

-- 3. Adicionar política UPDATE ausente para favorites
CREATE POLICY "Users can update their own favorites" ON public.favorites
FOR UPDATE USING (auth.uid() = user_id);

-- FASE 2: Fortalecimento da Integridade dos Dados

-- 4. Adicionar constraints de integridade para produtos
ALTER TABLE public.products 
ADD CONSTRAINT IF NOT EXISTS check_price_positive CHECK (price > 0);

ALTER TABLE public.products 
ADD CONSTRAINT IF NOT EXISTS check_original_price_positive CHECK (original_price IS NULL OR original_price > 0);

-- 5. Garantir que campos obrigatórios não sejam vazios
ALTER TABLE public.products 
ADD CONSTRAINT IF NOT EXISTS check_name_not_empty CHECK (LENGTH(TRIM(name)) > 0);

ALTER TABLE public.products 
ADD CONSTRAINT IF NOT EXISTS check_brand_not_empty CHECK (LENGTH(TRIM(brand)) > 0);

-- 6. Adicionar constraint de validação para roles
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS check_role_valid CHECK (role IN ('admin', 'user'));

-- FASE 3: Índices de Segurança para Performance

-- 7. Adicionar índices para melhorar performance das consultas de segurança
CREATE INDEX IF NOT EXISTS idx_profiles_role_security ON public.profiles(role) WHERE role = 'admin';
CREATE INDEX IF NOT EXISTS idx_admin_settings_key_security ON public.admin_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_security ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_security ON public.favorites(user_id);

-- FASE 4: Fortalecimento das Políticas de Isolamento

-- 8. Fortalecer políticas de cart_items para isolamento completo
DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart_items;
CREATE POLICY "Strict user cart view" ON public.cart_items
FOR SELECT USING (auth.uid() = user_id);

-- 9. Garantir que a função de verificação de role está otimizada
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
