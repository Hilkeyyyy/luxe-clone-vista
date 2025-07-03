
-- Criar bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Criar política para permitir que qualquer um visualize as imagens
CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Criar política para permitir que admins façam upload de imagens
CREATE POLICY "Admins can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Criar política para permitir que admins deletem imagens
CREATE POLICY "Admins can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND 
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
