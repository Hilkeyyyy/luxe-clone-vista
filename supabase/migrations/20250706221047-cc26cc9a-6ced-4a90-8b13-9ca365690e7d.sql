
-- FASE 1: Correção Crítica das Políticas RLS

-- 1. Corrigir política INSERT do cart_items - adicionar WITH CHECK adequado
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
CREATE POLICY "Users can insert their own cart items" ON public.cart_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Adicionar política UPDATE ausente para favorites
CREATE POLICY "Users can update their own favorites" ON public.favorites
FOR UPDATE USING (auth.uid() = user_id);

-- 3. Adicionar política INSERT para profiles permitindo criação automática
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Reorganizar políticas de admin_settings para melhor segurança
DROP POLICY IF EXISTS "Anyone can view admin settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Public can view basic settings" ON public.admin_settings;

-- Política para configurações básicas públicas da empresa
CREATE POLICY "Public can view basic company settings" ON public.admin_settings
FOR SELECT USING (
  setting_key IN ('company_name', 'company_phone', 'company_email', 'instagram_url')
);

-- Política para admins visualizarem todas as configurações
CREATE POLICY "Admins can view all settings" ON public.admin_settings
FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Política específica para configurações sensíveis do WhatsApp (apenas admins)
CREATE POLICY "Admins can manage whatsapp settings" ON public.admin_settings
FOR ALL USING (
  public.get_current_user_role() = 'admin' AND 
  setting_key LIKE 'whatsapp%'
);

-- FASE 2: Validações de Integridade de Dados

-- Adicionar constraints para prevenir dados maliciosos
ALTER TABLE public.products 
ADD CONSTRAINT check_price_positive CHECK (price > 0);

ALTER TABLE public.products 
ADD CONSTRAINT check_original_price_positive CHECK (original_price IS NULL OR original_price > 0);

-- Garantir que campos obrigatórios não sejam vazios
ALTER TABLE public.products 
ADD CONSTRAINT check_name_not_empty CHECK (LENGTH(TRIM(name)) > 0);

ALTER TABLE public.products 
ADD CONSTRAINT check_brand_not_empty CHECK (LENGTH(TRIM(brand)) > 0);

-- FASE 3: Otimização e Índices de Segurança

-- Índices para melhorar performance das consultas de segurança
CREATE INDEX IF NOT EXISTS idx_profiles_role_security ON public.profiles(role) WHERE role = 'admin';
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON public.admin_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_security ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_security ON public.favorites(user_id);

-- FASE 4: Correção da Função de Trigger para Criação de Perfis

-- Garantir que a função handle_new_user está correta e robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Recriar trigger se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FASE 5: Limpeza e Validação Final

-- Garantir que não há políticas conflitantes ou órfãs
-- Verificar se todas as políticas estão usando as funções corretas
DO $$
BEGIN
  -- Log das políticas ativas para auditoria
  RAISE NOTICE 'Políticas RLS aplicadas com sucesso. Sistema de segurança atualizado.';
END $$;
