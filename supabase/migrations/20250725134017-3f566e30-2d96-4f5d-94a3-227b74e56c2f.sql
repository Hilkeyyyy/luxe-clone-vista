
-- Corrigir a função de atualização de contagem de produtos por categoria
CREATE OR REPLACE FUNCTION public.update_brand_category_products_count()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Atualizar contagem de produtos para cada categoria baseado na marca
  -- Contar apenas produtos em estoque (in_stock = true), independente de sold_out
  UPDATE brand_categories 
  SET products_count = (
    SELECT COUNT(*)
    FROM products 
    WHERE UPPER(products.brand) = UPPER(brand_categories.name)
    AND products.in_stock = true
  );
  
  -- Log para debug
  RAISE NOTICE 'Contagem de produtos atualizada para todas as categorias';
END;
$function$;

-- Corrigir o trigger de sincronização
CREATE OR REPLACE FUNCTION public.sync_brand_category_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
    )
    WHERE UPPER(brand_categories.name) = UPPER(OLD.brand);
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Recriar o trigger para garantir que está funcionando
DROP TRIGGER IF EXISTS sync_brand_category_count_trigger ON products;
CREATE TRIGGER sync_brand_category_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION sync_brand_category_count();

-- Executar a atualização imediata de todas as contagens
SELECT update_brand_category_products_count();

-- Verificar as contagens atuais
SELECT 
  bc.name as categoria,
  bc.products_count as contagem_categoria,
  (SELECT COUNT(*) FROM products p WHERE UPPER(p.brand) = UPPER(bc.name) AND p.in_stock = true) as contagem_real
FROM brand_categories bc
ORDER BY bc.name;
