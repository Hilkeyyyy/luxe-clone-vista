
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import BrandCategoryCarousel from '../components/BrandCategoryCarousel';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Brand Category Carousel */}
      <BrandCategoryCarousel />
      
      <Footer />
    </div>
  );
};

export default Index;
