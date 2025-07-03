
-- Criar bucket para imagens de categorias de marcas
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-category-images', 'brand-category-images', true);

-- Criar política para permitir que qualquer um visualize as imagens
CREATE POLICY "Anyone can view brand category images" ON storage.objects
FOR SELECT USING (bucket_id = 'brand-category-images');

-- Criar política para permitir que admins façam upload de imagens
CREATE POLICY "Admins can upload brand category images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'brand-category-images' AND 
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Criar política para permitir que admins deletem imagens
CREATE POLICY "Admins can delete brand category images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'brand-category-images' AND 
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
