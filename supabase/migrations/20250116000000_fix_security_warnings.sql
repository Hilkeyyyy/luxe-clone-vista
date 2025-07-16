
-- Corrigir warnings de segurança nas funções existentes

-- 1. Atualizar função get_current_user_role com search_path seguro
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Atualizar função get_or_create_brand_category com search_path seguro
CREATE OR REPLACE FUNCTION public.get_or_create_brand_category(category_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  category_id UUID;
  category_slug TEXT;
BEGIN
  -- Normalizar o nome para slug
  category_slug := lower(regexp_replace(category_name, '[^a-zA-Z0-9]+', '-', 'g'));
  category_slug := trim(category_slug, '-');
  
  -- Verificar se categoria já existe
  SELECT id INTO category_id 
  FROM public.brand_categories 
  WHERE LOWER(name) = LOWER(category_name) OR slug = category_slug;
  
  -- Se não existir, criar nova categoria
  IF category_id IS NULL THEN
    INSERT INTO public.brand_categories (name, slug, description, is_active, order_position)
    VALUES (category_name, category_slug, 'Categoria criada automaticamente', true, 
            COALESCE((SELECT MAX(order_position) FROM public.brand_categories), 0) + 1)
    RETURNING id INTO category_id;
  END IF;
  
  RETURN category_id;
END;
$$;

-- 3. Atualizar função handle_new_user com search_path seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- 4. Atualizar função update_brand_category_products_count com search_path seguro
CREATE OR REPLACE FUNCTION public.update_brand_category_products_count()
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Atualizar contagem de produtos para cada categoria baseado na marca
  UPDATE public.brand_categories 
  SET products_count = (
    SELECT COUNT(*)
    FROM public.products 
    WHERE UPPER(public.products.brand) = UPPER(public.brand_categories.name)
    AND public.products.in_stock = true
    AND public.products.is_sold_out = false
  );
END;
$$;

-- 5. Atualizar função sync_brand_category_count com search_path seguro
CREATE OR REPLACE FUNCTION public.sync_brand_category_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Para INSERT e UPDATE
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    -- Atualizar categoria baseada na marca do produto
    UPDATE public.brand_categories 
    SET products_count = (
      SELECT COUNT(*)
      FROM public.products 
      WHERE UPPER(public.products.brand) = UPPER(public.brand_categories.name)
      AND public.products.in_stock = true
      AND public.products.is_sold_out = false
    )
    WHERE UPPER(public.brand_categories.name) = UPPER(NEW.brand);
    
    -- Se foi UPDATE e a marca mudou, atualizar a categoria anterior também
    IF TG_OP = 'UPDATE' AND OLD.brand != NEW.brand THEN
      UPDATE public.brand_categories 
      SET products_count = (
        SELECT COUNT(*)
        FROM public.products 
        WHERE UPPER(public.products.brand) = UPPER(public.brand_categories.name)
        AND public.products.in_stock = true
        AND public.products.is_sold_out = false
      )
      WHERE UPPER(public.brand_categories.name) = UPPER(OLD.brand);
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- Para DELETE
  IF TG_OP = 'DELETE' THEN
    UPDATE public.brand_categories 
    SET products_count = (
      SELECT COUNT(*)
      FROM public.products 
      WHERE UPPER(public.products.brand) = UPPER(public.brand_categories.name)
      AND public.products.in_stock = true
      AND public.products.is_sold_out = false
    )
    WHERE UPPER(public.brand_categories.name) = UPPER(OLD.brand);
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- 6. Atualizar função update_brand_category_count com search_path seguro
CREATE OR REPLACE FUNCTION public.update_brand_category_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Atualizar contador da categoria antiga (se houver)
  IF TG_OP = 'UPDATE' AND OLD.brand_category_id IS NOT NULL THEN
    UPDATE public.brand_categories 
    SET products_count = (
      SELECT COUNT(*) FROM public.products 
      WHERE brand_category_id = OLD.brand_category_id
    )
    WHERE id = OLD.brand_category_id;
  END IF;
  
  -- Atualizar contador da categoria nova
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.brand_category_id IS NOT NULL THEN
    UPDATE public.brand_categories 
    SET products_count = (
      SELECT COUNT(*) FROM public.products 
      WHERE brand_category_id = NEW.brand_category_id
    )
    WHERE id = NEW.brand_category_id;
  END IF;
  
  -- Para DELETE, atualizar contador da categoria antiga
  IF TG_OP = 'DELETE' AND OLD.brand_category_id IS NOT NULL THEN
    UPDATE public.brand_categories 
    SET products_count = (
      SELECT COUNT(*) FROM public.products 
      WHERE brand_category_id = OLD.brand_category_id
    )
    WHERE id = OLD.brand_category_id;
    RETURN OLD;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Comentário: Esta migração corrige os warnings de segurança adicionando SET search_path = '' 
-- em todas as funções SECURITY DEFINER para prevenir ataques de search_path
