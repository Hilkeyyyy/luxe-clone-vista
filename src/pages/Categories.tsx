
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  products_count: number;
  is_active: boolean;
}

const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    // Navegar para produtos filtrados por essa categoria
    navigate(`/produtos?categoria=${category.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-outfit">
        <Header />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Nossas Categorias</h1>
          <p className="text-neutral-600 text-lg">
            Explore nossos produtos por marca e categoria
          </p>
        </motion.div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-neutral-100 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleCategoryClick(category)}
              >
                {/* Category Image */}
                <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden relative">
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center">
                        <span className="text-neutral-500 font-outfit font-bold text-2xl">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Products Count Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-neutral-900 text-white px-3 py-1 rounded-full text-xs font-outfit font-semibold">
                      {category.products_count} produto{category.products_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="font-outfit font-bold text-xl text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 text-sm">
                      {category.products_count} produto{category.products_count !== 1 ? 's' : ''}
                    </span>
                    <motion.button
                      className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ver Produtos
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-neutral-600 text-lg">Nenhuma categoria disponível no momento.</p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
