
-- Atualizar o usuário para admin
UPDATE profiles 
SET role = 'admin' 
WHERE id = '0fef94be-d716-4b9c-8053-e351a66927dc';

-- Inserir configurações opcionais para controle de informações do produto  
INSERT INTO admin_settings (setting_key, setting_value) VALUES
('warranty_enabled', 'true'),
('warranty_info', '"Garantia de 12 meses contra defeitos de fabricação"'),
('delivery_enabled', 'true'), 
('delivery_info', '"Entrega em até 7 dias úteis para todo o Brasil"'),
('quality_enabled', 'true'),
('quality_info', '"Produtos testados e com certificado de qualidade"')
ON CONFLICT (setting_key) DO UPDATE SET 
setting_value = EXCLUDED.setting_value;
