
-- Configurar os dois UIDs especificados como administradores
-- UIDs: 589069fc-fb82-4388-a802-40d373950011 e 0fef94be-d716-4b9c-8053-e351a66927dc

-- Inserir ou atualizar os dois UIDs como administradores
INSERT INTO public.profiles (id, email, full_name, role)
VALUES 
  ('589069fc-fb82-4388-a802-40d373950011', 'admin1@megaclones.com', 'Administrador 1', 'admin'),
  ('0fef94be-d716-4b9c-8053-e351a66927dc', 'admin2@megaclones.com', 'Administrador 2', 'admin')
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = now();

-- Garantir que não há conflitos de email para os administradores
UPDATE public.profiles 
SET email = CASE 
  WHEN id = '589069fc-fb82-4388-a802-40d373950011' THEN 'admin1@megaclones.com'
  WHEN id = '0fef94be-d716-4b9c-8053-e351a66927dc' THEN 'admin2@megaclones.com'
  ELSE email
END,
full_name = CASE 
  WHEN id = '589069fc-fb82-4388-a802-40d373950011' THEN 'Administrador 1'
  WHEN id = '0fef94be-d716-4b9c-8053-e351a66927dc' THEN 'Administrador 2'
  ELSE full_name
END,
updated_at = now()
WHERE id IN ('589069fc-fb82-4388-a802-40d373950011', '0fef94be-d716-4b9c-8053-e351a66927dc');

-- Adicionar política INSERT ausente para profiles (necessária para criação automática de perfis)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Garantir política UPDATE ausente para favorites (necessária para o hook useSecureFavorites)
DROP POLICY IF EXISTS "Users can update their own favorites" ON public.favorites;
CREATE POLICY "Users can update their own favorites" ON public.favorites
FOR UPDATE USING (auth.uid() = user_id);

-- Log para confirmar que os administradores foram configurados
DO $$
BEGIN
  RAISE NOTICE '✅ Administradores configurados com sucesso:';
  RAISE NOTICE '   - UID: 589069fc-fb82-4388-a802-40d373950011 (Admin 1)';
  RAISE NOTICE '   - UID: 0fef94be-d716-4b9c-8053-e351a66927dc (Admin 2)';
  RAISE NOTICE '🔒 Sistema de isolamento de usuários ativo e funcional';
  RAISE NOTICE '🎯 Filtros de categoria corrigidos para usar marca (brand)';
  RAISE NOTICE '💾 Carrinho e favoritos migrados para banco de dados';
END $$;
