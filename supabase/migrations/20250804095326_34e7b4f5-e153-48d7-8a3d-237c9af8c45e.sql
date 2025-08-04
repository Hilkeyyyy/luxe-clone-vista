-- Simple fix: just update the data and handle constraint properly
UPDATE products 
SET clone_category = 'BASE ETA' 
WHERE clone_category = 'ETA Base';

-- Update any null values 
UPDATE products 
SET clone_category = 'Clone' 
WHERE clone_category IS NULL;

-- Drop any existing check constraints on clone_category
DO $$ 
DECLARE 
    constraint_name text;
BEGIN
    SELECT c.conname INTO constraint_name
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'products' 
    AND c.contype = 'c'
    AND pg_get_constraintdef(c.oid) LIKE '%clone_category%';
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE products DROP CONSTRAINT ' || quote_ident(constraint_name);
    END IF;
END $$;

-- Add new constraint with correct values
ALTER TABLE products ADD CONSTRAINT products_clone_category_check 
CHECK (clone_category = ANY (ARRAY['BASE ETA'::text, 'Clone'::text, 'Super Clone'::text]));

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for hero images
DO $$ 
BEGIN
    -- Drop policies if they exist to avoid conflicts
    DROP POLICY IF EXISTS "Anyone can view hero images" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can upload hero images" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can update hero images" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can delete hero images" ON storage.objects;

    -- Create new policies
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
END $$;

-- Add new settings for expanded hero configuration
INSERT INTO admin_settings (setting_key, setting_value) VALUES
('hero_subtitle', '{"value": ""}'),
('hero_button_primary_text', '{"value": "Explorar Coleção"}'),
('hero_button_secondary_text', '{"value": "Ver Destaques"}'),
('hero_overlay_opacity', '{"value": "0.7"}'),
('hero_text_position', '{"value": "center"}')
ON CONFLICT (setting_key) DO NOTHING;