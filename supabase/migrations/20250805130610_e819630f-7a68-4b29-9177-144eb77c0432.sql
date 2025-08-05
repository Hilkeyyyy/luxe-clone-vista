-- Primeiro, atualizar TODOS os produtos com categorias inválidas
UPDATE products 
SET clone_category = CASE 
    WHEN clone_category = 'ETA Base' THEN 'BASE ETA'
    WHEN clone_category IS NULL THEN 'Clone'
    WHEN clone_category NOT IN ('BASE ETA', 'Clone', 'Super Clone') THEN 'Clone'
    ELSE clone_category
END;

-- Remover constraint se existir
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_clone_category_check' 
        AND table_name = 'products'
    ) THEN
        ALTER TABLE products DROP CONSTRAINT products_clone_category_check;
    END IF;
END $$;

-- Adicionar nova constraint
ALTER TABLE products 
ADD CONSTRAINT products_clone_category_check 
CHECK (clone_category IN ('BASE ETA', 'Clone', 'Super Clone'));