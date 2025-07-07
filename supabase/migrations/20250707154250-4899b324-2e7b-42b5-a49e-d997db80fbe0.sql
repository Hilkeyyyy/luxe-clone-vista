
-- FASE 1: Correções Críticas de Segurança

-- 1. Adicionar política INSERT ausente para profiles (CRÍTICO para permitir registro)
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Corrigir políticas de admin_settings - remover acesso público total
DROP POLICY IF EXISTS "Anyone can view admin settings" ON public.admin_settings;

-- 3. Criar políticas mais restritivas para admin_settings
CREATE POLICY "Public can view basic company info only" ON public.admin_settings
FOR SELECT USING (
  setting_key IN ('company_name', 'company_phone', 'company_email', 'instagram_url')
);

CREATE POLICY "Admins can manage all settings" ON public.admin_settings
FOR ALL USING (public.get_current_user_role() = 'admin');

-- 4. Garantir que o trigger de criação de perfil existe e está correto
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
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Recriar trigger se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Adicionar constraints de segurança para integridade de dados
ALTER TABLE public.profiles 
ADD CONSTRAINT check_role_valid CHECK (role IN ('admin', 'user'));

-- 6. Adicionar índices para performance de consultas de segurança
CREATE INDEX IF NOT EXISTS idx_profiles_role_security ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_settings_key_security ON public.admin_settings(setting_key);

-- 7. Fortalecer políticas de carrinho e favoritos
DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;

CREATE POLICY "Strict user cart access" ON public.cart_items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Strict user favorites access" ON public.favorites
FOR SELECT USING (auth.uid() = user_id);
