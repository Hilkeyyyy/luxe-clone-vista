
-- Corrigir a função de contagem de produtos por marca/categoria
CREATE OR REPLACE FUNCTION update_brand_category_products_count()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Atualizar contagem de produtos para cada categoria baseado na marca
  UPDATE brand_categories 
  SET products_count = (
    SELECT COUNT(*)
    FROM products 
    WHERE UPPER(products.brand) = UPPER(brand_categories.name)
    AND products.in_stock = true
    AND products.is_sold_out = false
  );
END;
$$;

-- Executar a função para atualizar as contagens atuais
SELECT update_brand_category_products_count();

-- Criar trigger para manter as contagens sincronizadas
CREATE OR REPLACE FUNCTION sync_brand_category_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Para INSERT e UPDATE
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    -- Atualizar categoria baseada na marca do produto
    UPDATE brand_categories 
    SET products_count = (
      SELECT COUNT(*)
      FROM products 
      WHERE UPPER(products.brand) = UPPER(brand_categories.name)
      AND products.in_stock = true
      AND products.is_sold_out = false
    )
    WHERE UPPER(brand_categories.name) = UPPER(NEW.brand);
    
    -- Se foi UPDATE e a marca mudou, atualizar a categoria anterior também
    IF TG_OP = 'UPDATE' AND OLD.brand != NEW.brand THEN
      UPDATE brand_categories 
      SET products_count = (
        SELECT COUNT(*)
        FROM products 
        WHERE UPPER(products.brand) = UPPER(brand_categories.name)
        AND products.in_stock = true
        AND products.is_sold_out = false
      )
      WHERE UPPER(brand_categories.name) = UPPER(OLD.brand);
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- Para DELETE
  IF TG_OP = 'DELETE' THEN
    UPDATE brand_categories 
    SET products_count = (
      SELECT COUNT(*)
      FROM products 
      WHERE UPPER(products.brand) = UPPER(brand_categories.name)
      AND products.in_stock = true
      AND products.is_sold_out = false
    )
    WHERE UPPER(brand_categories.name) = UPPER(OLD.brand);
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS trigger_update_brand_category_count ON products;

-- Criar novo trigger
CREATE TRIGGER trigger_update_brand_category_count
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION sync_brand_category_count();

-- Habilitar realtime para atualizações instantâneas
ALTER TABLE brand_categories REPLICA IDENTITY FULL;
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE cart_items REPLICA IDENTITY FULL;
ALTER TABLE favorites REPLICA IDENTITY FULL;

-- Adicionar às publicações realtime
ALTER publication supabase_realtime ADD TABLE brand_categories;
ALTER publication supabase_realtime ADD TABLE products;
ALTER publication supabase_realtime ADD TABLE cart_items;
ALTER publication supabase_realtime ADD TABLE favorites;
