-- PASSO 1: Corrigir erro BASE ETA

-- Atualizar todos os produtos 'ETA Base' para 'BASE ETA'
UPDATE products 
SET clone_category = 'BASE ETA' 
WHERE clone_category = 'ETA Base';

-- Remover constraint atual se existir
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

-- Adicionar nova constraint corrigida
ALTER TABLE products 
ADD CONSTRAINT products_clone_category_check 
CHECK (clone_category IN ('BASE ETA', 'Clone', 'Super Clone'));