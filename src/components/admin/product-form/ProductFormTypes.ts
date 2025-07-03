
export interface WatchSpecifications {
  modelo?: string;
  linha?: string;
  referencia?: string;
  formato_caixa?: string;
  espessura?: string;
  cor_caixa?: string;
  acabamento_caixa?: string;
  tipo_vidro?: string;
  cor_mostrador?: string;
  tipo_indices?: string;
  subdials?: string;
  data?: string;
  gmt?: string;
  tipo_pulseira?: string;
  material_pulseira?: string;
  cor_pulseira?: string;
  tipo_fecho?: string;
  comprimento_pulseira?: string;
  calibre?: string;
  frequencia?: string;
  reserva_marcha?: string;
  joias?: string;
  certificacao_movimento?: string;
  cronografo?: string;
  alarme?: string;
  bussola?: string;
  calculadora?: string;
  taquimetro?: string;
  telemetro?: string;
  choque?: string;
  magnetismo?: string;
  temperatura?: string;
  cosc?: string;
  teste_marca?: string;
  garantia?: string;
}

export interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  clone_category: string;
  price: number;
  original_price?: number;
  description?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  is_featured?: boolean;
  is_new?: boolean;
  is_sold_out?: boolean;
  is_bestseller?: boolean;
  is_coming_soon?: boolean;
  custom_badge?: string;
  movement?: string;
  diameter?: string;
  material?: string;
  water_resistance?: string;
  specifications?: WatchSpecifications;
}

export interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}
