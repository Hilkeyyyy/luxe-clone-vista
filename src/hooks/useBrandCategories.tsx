
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  order_position: number;
  is_active: boolean;
  products_count: number;
}

export const useBrandCategories = (activeOnly: boolean = false) => {
  const [categories, setCategories] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    
    // Realtime listener para mudanças
    const channel = supabase
      .channel('brand-categories-realtime-enhanced')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brand_categories'
        },
        (payload) => {
          console.log('🔄 Categoria de marca alterada:', payload.eventType, payload.new || payload.old);
          fetchCategories();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔄 Produto alterado, atualizando contagem:', payload.eventType);
          setTimeout(() => {
            fetchCategories();
          }, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOnly]);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Buscando categorias de marca...');
      
      // Buscar todas as categorias
      let categoriesQuery = supabase
        .from('brand_categories')
        .select('*')
        .order('order_position', { ascending: true });

      if (activeOnly) {
        categoriesQuery = categoriesQuery.eq('is_active', true);
      }

      const { data: categoriesData, error: categoriesError } = await categoriesQuery;

      if (categoriesError) {
        console.error('❌ Erro ao buscar categorias:', categoriesError);
        throw categoriesError;
      }

      console.log('📊 Categorias encontradas:', categoriesData?.length || 0);

      // Se não há categorias, criar uma categoria "Outras Marcas" com produtos sem categoria
      if (!categoriesData || categoriesData.length === 0) {
        console.log('⚠️ Nenhuma categoria encontrada, buscando produtos sem categoria...');
        
        // Buscar todas as marcas únicas dos produtos
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('brand')
          .eq('in_stock', true)
          .neq('is_sold_out', true);

        if (!productsError && productsData && productsData.length > 0) {
          // Agrupar por marca e contar produtos
          const brandCounts = productsData.reduce((acc, product) => {
            const brand = product.brand;
            acc[brand] = (acc[brand] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const fallbackCategories = Object.entries(brandCounts).map(([brand, count]) => ({
            id: `fallback-${brand.toLowerCase().replace(/\s+/g, '-')}`,
            name: brand,
            slug: brand.toLowerCase().replace(/\s+/g, '-'),
            description: `Produtos da marca ${brand}`,
            image_url: '',
            order_position: 0,
            is_active: true,
            products_count: count
          }));

          console.log('✅ Categorias fallback criadas:', fallbackCategories.length);
          setCategories(fallbackCategories);
          setLoading(false);
          return;
        }
      }

      // Calcular contagem de produtos para cada categoria
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (category) => {
          console.log(`🔄 Contando produtos para categoria: ${category.name}`);
          
          // Buscar produtos que correspondem à marca da categoria
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .or(`brand.ilike.%${category.name}%,brand.eq.${category.name}`)
            .eq('in_stock', true)
            .neq('is_sold_out', true);

          if (countError) {
            console.error(`❌ Erro ao contar produtos para ${category.name}:`, countError);
            return { ...category, products_count: 0 };
          }

          const productCount = count || 0;
          console.log(`✅ ${category.name}: ${productCount} produtos`);
          
          return { ...category, products_count: productCount };
        })
      );

      // Filtrar categorias com produtos se activeOnly for true
      const filteredCategories = activeOnly 
        ? categoriesWithCount.filter(cat => cat.products_count > 0)
        : categoriesWithCount;

      console.log('✅ Categorias finais:', filteredCategories.length);
      console.log('📋 Lista de categorias:', filteredCategories.map(c => `${c.name} (${c.products_count} produtos)`));
      
      setCategories(filteredCategories);
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      
      // Fallback: buscar produtos diretamente e criar categorias temporárias
      try {
        console.log('🔄 Tentando fallback com produtos...');
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('brand')
          .eq('in_stock', true)
          .neq('is_sold_out', true);

        if (!productsError && productsData && productsData.length > 0) {
          const brandCounts = productsData.reduce((acc, product) => {
            const brand = product.brand;
            acc[brand] = (acc[brand] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const fallbackCategories = Object.entries(brandCounts).map(([brand, count]) => ({
            id: `fallback-${brand.toLowerCase().replace(/\s+/g, '-')}`,
            name: brand,
            slug: brand.toLowerCase().replace(/\s+/g, '-'),
            description: `Produtos da marca ${brand}`,
            image_url: '',
            order_position: 0,
            is_active: true,
            products_count: count
          }));

          console.log('✅ Fallback aplicado com sucesso:', fallbackCategories.length);
          setCategories(fallbackCategories);
        } else {
          setCategories([]);
        }
      } catch (fallbackError) {
        console.error('❌ Erro no fallback:', fallbackError);
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, refetch: fetchCategories };
};
