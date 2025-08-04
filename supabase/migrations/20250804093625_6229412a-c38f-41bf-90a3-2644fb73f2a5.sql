-- Check current constraint and remove it
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'products' AND constraint_type = 'CHECK';

-- Drop all CHECK constraints on products table that might be causing issues
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT constraint_name FROM information_schema.table_constraints 
              WHERE table_name = 'products' AND constraint_type = 'CHECK')
    LOOP
        EXECUTE 'ALTER TABLE products DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- Update existing products to use the correct value
UPDATE products 
SET clone_category = 'BASE ETA' 
WHERE clone_category = 'ETA Base' OR clone_category IS NULL;

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