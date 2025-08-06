-- Criar bucket para imagens do hero se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-images', 
  'hero-images', 
  true, 
  5242880, 
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Política para upload de imagens do hero (apenas usuários autenticados)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can upload hero images'
  ) THEN
    CREATE POLICY "Users can upload hero images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'hero-images' AND auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Política para atualizar imagens do hero (apenas usuários autenticados)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update hero images'
  ) THEN
    CREATE POLICY "Users can update hero images" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'hero-images' AND auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Política para deletar imagens do hero (apenas usuários autenticados)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete hero images'
  ) THEN
    CREATE POLICY "Users can delete hero images" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'hero-images' AND auth.uid() IS NOT NULL);
  END IF;
END $$;