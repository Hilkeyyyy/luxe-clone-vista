-- Remover tabela carousel_config que está causando constraint errors
DROP TABLE IF EXISTS public.carousel_config CASCADE;

-- Atualizar configurações padrão para VELAR WATCHES
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES 
  ('whatsapp_number', '"19999413755"'),
  ('company_name', '"VELAR WATCHES"'),
  ('company_phone', '"(19) 99941-3755"'),
  ('instagram_url', '"https://www.instagram.com/velar.watches/"'),
  ('whatsapp_message_template', '"⏱️ Pedido de Produto\n\n• Nome do Produto: {product_name}\n• Quantidade: {quantity}\n• Preço Unitário: R$ {unit_price}\n• Total a Pagar: R$ {total_price}\n• Imagem do Produto: {product_image}\n\n🕒 Gerado em: {timestamp}\n\n📩 Mensagem:\nOlá! Gostei muito deste(s) produto(s) e tenho interesse em comprá-lo(s). Poderia me passar mais informações sobre pagamento, envio e disponibilidade?\n\nAguardo seu retorno. Obrigado(a)!"')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();