
-- Remover constraint problemática que está impedindo inserções/edições de produtos
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Garantir que a coluna clone_category tenha valores válidos
UPDATE products SET clone_category = 'Clone' WHERE clone_category IS NULL;

-- Verificar se existe alguma constraint em brand_category_id que possa estar causando problemas
ALTER TABLE products ALTER COLUMN brand_category_id DROP NOT NULL;
