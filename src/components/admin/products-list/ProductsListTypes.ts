
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  clone_category: string;
  price: number;
  original_price?: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_sold_out?: boolean;
  is_bestseller?: boolean;
  is_coming_soon?: boolean;
  custom_badge?: string;
  images: string[];
  created_at: string;
}

export interface ProductsListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
}
