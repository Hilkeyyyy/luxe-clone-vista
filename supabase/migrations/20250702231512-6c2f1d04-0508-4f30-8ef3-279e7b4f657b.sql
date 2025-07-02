
-- Adicionar campos necessários na tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_coming_soon BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_badge TEXT,
ADD COLUMN IF NOT EXISTS movement TEXT,
ADD COLUMN IF NOT EXISTS diameter TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS water_resistance TEXT;

-- Atualizar a tabela brand_categories para permitir edição completa
ALTER TABLE brand_categories 
ADD COLUMN IF NOT EXISTS products_count INTEGER DEFAULT 0;

-- Função para atualizar contador de produtos por categoria
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
  IF NEW.brand_category_id IS NOT NULL THEN
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar contador automaticamente
DROP TRIGGER IF EXISTS update_category_count_trigger ON products;
CREATE TRIGGER update_category_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_category_count();

-- Função para criar categoria automaticamente quando não existir
CREATE OR REPLACE FUNCTION get_or_create_brand_category(category_name TEXT)
RETURNS UUID AS $$
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
    INSERT INTO brand_categories (name, slug, description, is_active)
    VALUES (category_name, category_slug, 'Categoria criada automaticamente', true)
    RETURNING id INTO category_id;
  END IF;
  
  RETURN category_id;
END;
$$ LANGUAGE plpgsql;

-- Atualizar contadores existentes
UPDATE brand_categories 
SET products_count = (
  SELECT COUNT(*) FROM products 
  WHERE brand_category_id = brand_categories.id
);
