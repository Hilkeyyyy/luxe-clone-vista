
-- Fix critical RLS policy issues

-- 1. Fix cart_items INSERT policy - add proper WITH CHECK clause
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
CREATE POLICY "Users can insert their own cart items" ON public.cart_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Add missing favorites UPDATE policy
CREATE POLICY "Users can update their own favorites" ON public.favorites
FOR UPDATE USING (auth.uid() = user_id);

-- 3. Add missing profiles INSERT policy for automatic profile creation
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Strengthen admin settings policies - ensure only basic settings are publicly viewable
DROP POLICY IF EXISTS "Anyone can view admin settings" ON public.admin_settings;
CREATE POLICY "Public can view basic company settings" ON public.admin_settings
FOR SELECT USING (
  setting_key IN ('company_name', 'company_phone', 'company_email', 'instagram_url')
);

-- 5. Add policy for admin-only sensitive settings
CREATE POLICY "Admins can view all settings" ON public.admin_settings
FOR SELECT USING (public.get_current_user_role() = 'admin');

-- 6. Ensure whatsapp settings are admin-only
CREATE POLICY "Admins can manage whatsapp settings" ON public.admin_settings
FOR ALL USING (
  public.get_current_user_role() = 'admin' AND 
  setting_key LIKE 'whatsapp%'
);

-- 7. Add constraint to prevent malicious data in products table
ALTER TABLE public.products 
ADD CONSTRAINT check_price_positive CHECK (price > 0);

ALTER TABLE public.products 
ADD CONSTRAINT check_original_price_positive CHECK (original_price IS NULL OR original_price > 0);

-- 8. Add constraint to ensure brand and name are not empty
ALTER TABLE public.products 
ADD CONSTRAINT check_name_not_empty CHECK (LENGTH(TRIM(name)) > 0);

ALTER TABLE public.products 
ADD CONSTRAINT check_brand_not_empty CHECK (LENGTH(TRIM(brand)) > 0);

-- 9. Add indexes for better security query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role_security ON public.profiles(role) WHERE role = 'admin';
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON public.admin_settings(setting_key);
