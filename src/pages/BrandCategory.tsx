
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid, List } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  images: string[];
  is_new: boolean;
  is_featured: boolean;
  clone_category?: string;
  stock_status: string;
  created_at: string;
}

interface BrandCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  products_count: number;
}

const BrandCategory = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState<BrandCategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    try {
      // Buscar categoria por slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('brand_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Buscar produtos da categoria
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('brand_category_id', categoryData.id)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

    } catch (error) {
      console.error('Erro ao buscar categoria e produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
        return sorted.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      default: // newest
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [products, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando produtos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Categoria não encontrada</h1>
            <p className="text-neutral-600">A categoria que você está procurando não existe.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center mb-6">
            {category.image_url && (
              <img 
                src={category.image_url} 
                alt={category.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                Relógios {category.name}
              </h1>
              <p className="text-neutral-600 text-lg">
                {category.description || `Explore nossa coleção completa de relógios ${category.name}`}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                {category.products_count} produto{category.products_count !== 1 ? 's' : ''} disponível{category.products_count !== 1 ? 'is' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <span className="text-neutral-600">
              {sortedProducts.length} produtos encontrados
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              <option value="newest">Mais Recentes</option>
              <option value="featured">Destaques Primeiro</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name">Nome A-Z</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-neutral-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-100' : ''}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-neutral-100' : ''}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {sortedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              price={`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              originalPrice={product.original_price 
                ? `R$ ${product.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                : undefined}
              image={product.images[0]}
              isNew={product.is_new}
              featured={product.is_featured}
              clone_category={product.clone_category}
              stock_status={product.stock_status}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-600 text-lg">
              Nenhum produto disponível nesta categoria no momento.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BrandCategory;
