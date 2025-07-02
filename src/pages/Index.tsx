
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import BrandCategoryCarousel from '../components/BrandCategoryCarousel';
import Footer from '../components/Footer';
import { useBrandCategories } from '@/hooks/useBrandCategories';

const Index = () => {
  const { categories, loading } = useBrandCategories();

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-outfit flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Brand Category Carousels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.map((category) => (
          <BrandCategoryCarousel 
            key={category.id} 
            category={category} 
          />
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
