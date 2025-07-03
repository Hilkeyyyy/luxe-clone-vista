
-- Adicionar campo stock_status na tabela products
ALTER TABLE products ADD COLUMN stock_status TEXT NOT NULL DEFAULT 'in_stock';

-- Adicionar constraint para garantir valores válidos
ALTER TABLE products ADD CONSTRAINT stock_status_check 
CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock'));

-- Atualizar produtos existentes baseado no campo in_stock
UPDATE products 
SET stock_status = CASE 
    WHEN in_stock = false THEN 'out_of_stock'
    ELSE 'in_stock'
END;

-- Criar índice para melhor performance
CREATE INDEX idx_products_stock_status ON products(stock_status);
