// Tipo principal Product baseado na estrutura do banco
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  clone_category?: string;
  price: number;
  original_price?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  is_new?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_sold_out?: boolean;
  is_coming_soon?: boolean;
  custom_badge?: string;
  in_stock?: boolean;
  stock_status: string;
  created_at: string;
  description?: string;
  movement?: string;
  diameter?: string;
  material?: string;
  water_resistance?: string;
  brand_category_id?: string;
  specifications?: any;
  updated_at?: string;
}

// Tipo simplificado para displays
export interface ProductDisplay {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  clone_category?: string;
  is_new?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_sold_out?: boolean;
  custom_badge?: string;
  stock_status: string;
}