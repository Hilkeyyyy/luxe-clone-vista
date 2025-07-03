
-- Corrigir a função get_or_create_brand_category para funcionar corretamente
CREATE OR REPLACE FUNCTION public.get_or_create_brand_category(category_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
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
  FROM brand_categories 
  WHERE LOWER(name) = LOWER(category_name) OR slug = category_slug;
  
  -- Se não existir, criar nova categoria
  IF category_id IS NULL THEN
    INSERT INTO brand_categories (name, slug, description, is_active, order_position)
    VALUES (category_name, category_slug, 'Categoria criada automaticamente', true, 
            COALESCE((SELECT MAX(order_position) FROM brand_categories), 0) + 1)
    RETURNING id INTO category_id;
  END IF;
  
  RETURN category_id;
END;
$$;

-- Remover constraint problemática da tabela carousel_config que impede exclusão de produtos
ALTER TABLE carousel_config DROP CONSTRAINT IF EXISTS carousel_config_product_id_fkey;

-- Recriar a constraint com CASCADE para permitir exclusão
ALTER TABLE carousel_config 
ADD CONSTRAINT carousel_config_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Garantir que a função de atualização de contador funcione corretamente
CREATE OR REPLACE FUNCTION update_brand_category_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contador da categoria antiga (se houver)
  IF TG_OP = 'UPDATE' AND OLD.brand_category_id IS NOT NULL THEN
    UPDATE brand_categories 
    SET products_count = (
      SELECT COUNT(*) FROM products 
      WHERE brand_category_id = OLD.brand_category_id
    )
    WHERE id = OLD.brand_category_id;
  END IF;
  
  -- Atualizar contador da categoria nova
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.brand_category_id IS NOT NULL THEN
    UPDATE brand_categories 
    SET products_count = (
      SELECT COUNT(*) FROM products 
      WHERE brand_category_id = NEW.brand_category_id
    )
    WHERE id = NEW.brand_category_id;
  END IF;
  
  -- Para DELETE, atualizar contador da categoria antiga
  IF TG_OP = 'DELETE' AND OLD.brand_category_id IS NOT NULL THEN
    UPDATE brand_categories 
    SET products_count = (
      SELECT COUNT(*) FROM products 
      WHERE brand_category_id = OLD.brand_category_id
    )
    WHERE id = OLD.brand_category_id;
    RETURN OLD;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
