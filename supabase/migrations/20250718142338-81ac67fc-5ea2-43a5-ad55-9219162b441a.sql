
-- FASE 1: Correções Críticas de Segurança no Banco de Dados

-- 1. Corrigir vulnerabilidades de search_path em todas as funções SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_or_create_brand_category(category_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  category_id UUID;
  category_slug TEXT;
BEGIN
  -- Normalizar o nome para slug
  category_slug := lower(regexp_replace(category_name, '[^a-zA-Z0-9]+', '-', 'g'));
  category_slug := trim(category_slug, '-');
  
  -- Verificar se categoria já existe
  SELECT id INTO category_id 
  FROM public.brand_categories 
  WHERE LOWER(name) = LOWER(category_name) OR slug = category_slug;
  
  -- Se não existir, criar nova categoria
  IF category_id IS NULL THEN
    INSERT INTO public.brand_categories (name, slug, description, is_active, order_position)
    VALUES (category_name, category_slug, 'Categoria criada automaticamente', true, 
            COALESCE((SELECT MAX(order_position) FROM public.brand_categories), 0) + 1)
    RETURNING id INTO category_id;
  END IF;
  
  RETURN category_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- 2. Fortalecer controle de acesso baseado em roles
-- Adicionar política para prevenir usuários de alterarem seu próprio role
CREATE POLICY "Users cannot change their own role" ON public.profiles
FOR UPDATE USING (
  auth.uid() = id AND 
  (OLD.role = NEW.role OR public.get_current_user_role() = 'admin')
);

-- 3. Adicionar constraints de segurança para integridade de dados
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS check_role_valid CHECK (role IN ('admin', 'user'));

-- Adicionar constraint para prevenir emails vazios
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS check_email_not_empty CHECK (
  email IS NULL OR LENGTH(TRIM(email)) > 0
);

-- 4. Fortalecer políticas de admin_settings para configurações sensíveis
DROP POLICY IF EXISTS "Public can view basic settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Public can view basic company info only" ON public.admin_settings;

-- Política mais restritiva para informações públicas
CREATE POLICY "Public can view company info only" ON public.admin_settings
FOR SELECT USING (
  setting_key IN ('company_name', 'company_phone', 'company_email', 'instagram_url')
);

-- Política específica para configurações sensíveis do WhatsApp (apenas admins)
CREATE POLICY "Admins only whatsapp settings" ON public.admin_settings
FOR ALL USING (
  public.get_current_user_role() = 'admin' AND 
  setting_key LIKE 'whatsapp%'
);

-- 5. Adicionar auditoria básica para mudanças de role
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Admins can view audit logs" ON public.security_audit_log
FOR SELECT USING (public.get_current_user_role() = 'admin');

-- 6. Adicionar índices de segurança para performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON public.security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at);

-- 7. Função para log de auditoria
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}',
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (user_id, action, details, ip_address, user_agent)
  VALUES (p_user_id, p_action, p_details, p_ip_address, p_user_agent);
END;
$$;

-- 8. Trigger para auditar mudanças de role
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auditar mudanças de role
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    PERFORM public.log_security_event(
      NEW.id,
      'role_change',
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para auditoria de profiles
DROP TRIGGER IF EXISTS audit_profile_changes_trigger ON public.profiles;
CREATE TRIGGER audit_profile_changes_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_profile_changes();

-- 9. Adicionar rate limiting básico para tentativas de login
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address inet,
  attempt_time timestamp with time zone DEFAULT now(),
  success boolean DEFAULT false
);

-- RLS para login_attempts
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver tentativas de login
CREATE POLICY "Admins can view login attempts" ON public.login_attempts
FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Índice para performance de consultas de rate limiting
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_time ON public.login_attempts(email, attempt_time);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON public.login_attempts(ip_address, attempt_time);
