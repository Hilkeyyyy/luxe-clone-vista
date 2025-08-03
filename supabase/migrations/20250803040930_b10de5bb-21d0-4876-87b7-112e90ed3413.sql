-- Fix the CHECK constraint to allow 'BASE ETA' instead of 'ETA Base'
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_clone_category_check;

-- Add new constraint with correct values
ALTER TABLE products ADD CONSTRAINT products_clone_category_check 
CHECK (clone_category = ANY (ARRAY['BASE ETA'::text, 'Clone'::text, 'Super Clone'::text]));

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for hero images
CREATE POLICY "Anyone can view hero images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can upload hero images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'hero-images' AND 
  get_current_user_role() = 'admin'
);

CREATE POLICY "Admins can update hero images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'hero-images' AND 
  get_current_user_role() = 'admin'
);

CREATE POLICY "Admins can delete hero images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'hero-images' AND 
  get_current_user_role() = 'admin'
);

-- Add new settings for expanded hero configuration
INSERT INTO admin_settings (setting_key, setting_value) VALUES
('hero_subtitle', '{"value": ""}'),
('hero_button_primary_text', '{"value": "Explorar Coleção"}'),
('hero_button_secondary_text', '{"value": "Ver Destaques"}'),
('hero_overlay_opacity', '{"value": "0.7"}'),
('hero_text_position', '{"value": "center"}')
ON CONFLICT (setting_key) DO NOTHING;