
-- Criar tabela para categorias de marcas
CREATE TABLE public.brand_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  order_position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar coluna brand_category_id na tabela products
ALTER TABLE public.products 
ADD COLUMN brand_category_id UUID REFERENCES public.brand_categories(id);

-- Criar índices para melhor performance
CREATE INDEX idx_brand_categories_active ON public.brand_categories(is_active);
CREATE INDEX idx_brand_categories_order ON public.brand_categories(order_position);
CREATE INDEX idx_products_brand_category ON public.products(brand_category_id);

-- RLS para brand_categories
ALTER TABLE public.brand_categories ENABLE ROW LEVEL SECURITY;

-- Política para visualizar categorias ativas
CREATE POLICY "Anyone can view active brand categories" 
  ON public.brand_categories 
  FOR SELECT 
  USING (is_active = true);

-- Política para admins gerenciarem categorias
CREATE POLICY "Only admins can manage brand categories" 
  ON public.brand_categories 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Inserir algumas categorias iniciais
INSERT INTO public.brand_categories (name, slug, description, order_position, image_url) VALUES
('Rolex', 'rolex', 'Relógios de luxo suíços com tradição centenária', 1, 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&h=400&fit=crop'),
('Cartier', 'cartier', 'Joalheria e relojoaria francesa de alta qualidade', 2, 'https://images.unsplash.com/photo-1592821602714-c7b33b2d9e79?w=800&h=400&fit=crop'),
('Patek Philippe', 'patek-philippe', 'Manufatura suíça de relógios de prestígio', 3, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=400&fit=crop'),
('Omega', 'omega', 'Relógios suíços conhecidos pela precisão', 4, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=400&fit=crop');
