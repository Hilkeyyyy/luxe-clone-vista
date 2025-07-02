
-- Inserir o perfil de administrador se não existir
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '589069fc-fb82-4388-a802-40d373950011',
  'admin@megaclones.com',
  'Administrador',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = now();

-- Garantir que as configurações de admin existam
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
('whatsapp_config', '{"number": "5586988388124", "business_hours": "09:00-18:00"}'),
('site_config', '{"company_name": "Mega Clones", "logo_url": ""}')
ON CONFLICT (setting_key) DO NOTHING;
