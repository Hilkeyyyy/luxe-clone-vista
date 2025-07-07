
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useBrandCategories } from '@/hooks/useBrandCategories';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const { categories, loading } = useBrandCategories();
  const navigate = useNavigate();

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Categorias</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/products?category=${category.slug}`)}
              >
                <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <span className="text-4xl font-bold">{category.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  {category.products_count !== null && (
                    <div className="mt-2">
                      <span className="text-xs text-neutral-500">
                        {category.products_count} produto{category.products_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-600">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Categories;
