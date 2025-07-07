
-- FASE 1: Correção crítica do banco de dados
-- Verificar e corrigir problemas estruturais

-- 1. Garantir que a tabela brand_categories existe e está correta
-- (Esta tabela já existe, mas vamos verificar integridade)

-- 2. Corrigir possíveis problemas na tabela profiles
-- Garantir que todos os usuários têm perfil único
CREATE OR REPLACE FUNCTION public.fix_duplicate_profiles()
RETURNS void AS $$
BEGIN
  -- Remover perfis duplicados, mantendo apenas o mais recente
  DELETE FROM public.profiles 
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
      FROM public.profiles
      WHERE email IS NOT NULL
    ) t
    WHERE t.rn > 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar a limpeza
SELECT public.fix_duplicate_profiles();

-- 3. Melhorar a função de criação de perfil para evitar conflitos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Inserir perfil apenas se não existir
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

-- 4. Recriar o trigger se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Adicionar índices para melhor performance e evitar conflitos
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 6. Garantir que pelo menos um usuário seja admin
-- (Você pode ajustar o email para o seu email de admin)
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  gen_random_uuid(),
  'operacional.grupostratton@gmail.com',
  'Administrador',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  updated_at = now();

-- 7. Fortalecer as políticas RLS para isolamento completo
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Políticas mais rigorosas
CREATE POLICY "Users can view only their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update only their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. Fortalecer isolamento nos favoritos e carrinho
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;

CREATE POLICY "Strict user favorites view" ON public.favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Strict user favorites insert" ON public.favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Strict user favorites delete" ON public.favorites
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Strict user favorites update" ON public.favorites
FOR UPDATE USING (auth.uid() = user_id);

-- Mesma coisa para carrinho
DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

CREATE POLICY "Strict user cart view" ON public.cart_items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Strict user cart insert" ON public.cart_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Strict user cart update" ON public.cart_items
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Strict user cart delete" ON public.cart_items
FOR DELETE USING (auth.uid() = user_id);
