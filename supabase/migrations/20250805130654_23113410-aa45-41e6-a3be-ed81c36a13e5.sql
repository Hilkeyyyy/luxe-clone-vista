-- Remover todas as constraints relacionadas primeiro
DO $$ 
BEGIN
    -- Tentar remover constraints existentes
    BEGIN
        ALTER TABLE products DROP CONSTRAINT IF EXISTS products_clone_category_check;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignorar se não existir
    END;
    
    BEGIN
        ALTER TABLE products DROP CONSTRAINT IF EXISTS clone_category_check;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Atualizar produtos com valor inválido
UPDATE products 
SET clone_category = 'BASE ETA' 
WHERE clone_category = 'ETA Base';

-- Garantir que não há valores nulos
UPDATE products 
SET clone_category = 'Clone' 
WHERE clone_category IS NULL OR clone_category = '';

-- Adicionar constraint correta
ALTER TABLE products 
ADD CONSTRAINT products_clone_category_check 
CHECK (clone_category IN ('BASE ETA', 'Clone', 'Super Clone'));