
-- Primeiro, vamos criar algumas categorias de marca padrão
INSERT INTO brand_categories (name, slug, description, image_url, order_position) VALUES
('Rolex', 'rolex', 'Relógios de luxo suíços com tradição centenária', 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&h=400&fit=crop', 1),
('Omega', 'omega', 'Precisão suíça e inovação em cada detalhe', 'https://images.unsplash.com/photo-1548181659-84b4e8f7e7d4?w=800&h=400&fit=crop', 2),
('TAG Heuer', 'tag-heuer', 'Cronógrafos esportivos de alta performance', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=400&fit=crop', 3),
('Breitling', 'breitling', 'Instrumentos de precisão para aviação', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=400&fit=crop', 4)
ON CONFLICT (slug) DO NOTHING;

-- Agora vamos atualizar os produtos existentes para vincular às categorias
-- Vamos assumir que temos produtos das marcas Rolex, Omega, TAG Heuer e Breitling
UPDATE products 
SET brand_category_id = (
  SELECT id FROM brand_categories WHERE slug = 'rolex' LIMIT 1
)
WHERE LOWER(brand) LIKE '%rolex%';

UPDATE products 
SET brand_category_id = (
  SELECT id FROM brand_categories WHERE slug = 'omega' LIMIT 1
)
WHERE LOWER(brand) LIKE '%omega%';

UPDATE products 
SET brand_category_id = (
  SELECT id FROM brand_categories WHERE slug = 'tag-heuer' LIMIT 1
)
WHERE LOWER(brand) LIKE '%tag%' OR LOWER(brand) LIKE '%heuer%';

UPDATE products 
SET brand_category_id = (
  SELECT id FROM brand_categories WHERE slug = 'breitling' LIMIT 1
)
WHERE LOWER(brand) LIKE '%breitling%';

-- Para produtos que não se encaixam nas categorias acima, vamos criar uma categoria genérica
INSERT INTO brand_categories (name, slug, description, image_url, order_position) VALUES
('Outras Marcas', 'outras-marcas', 'Coleção diversificada de marcas premium', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=400&fit=crop', 5)
ON CONFLICT (slug) DO NOTHING;

-- Vincular produtos sem categoria à categoria genérica
UPDATE products 
SET brand_category_id = (
  SELECT id FROM brand_categories WHERE slug = 'outras-marcas' LIMIT 1
)
WHERE brand_category_id IS NULL;
