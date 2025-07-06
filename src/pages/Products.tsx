
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductsHeader from '@/components/products/ProductsHeader';
import CloneCategoryHighlight from '@/components/products/CloneCategoryHighlight';
import ProductFilters from '@/components/products/ProductFilters';
import ProductsGrid from '@/components/products/ProductsGrid';
import ProductCount from '@/components/ui/ProductCount';
import { useProductsFilter } from '@/hooks/useProductsFilter';

const Products = () => {
  const {
    products,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedCloneCategory,
    setSelectedCloneCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    categories,
    cloneCategories,
    clearFilters,
  } = useProductsFilter();

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
        <ProductsHeader />

        <CloneCategoryHighlight
          categories={cloneCategories}
          selectedCategory={selectedCloneCategory}
          onCategorySelect={setSelectedCloneCategory}
        />

        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCloneCategory={selectedCloneCategory}
          onCloneCategoryChange={setSelectedCloneCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          categories={categories}
          cloneCategories={cloneCategories}
        />

        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <ProductCount count={products.length} />
        </motion.div>

        <ProductsGrid 
          products={products}
          onClearFilters={clearFilters}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Products;
