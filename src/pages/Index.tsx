
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import Footer from '../components/Footer';

const Index = () => {
  const topCarouselProducts = [
    { id: 1, name: "Clone Tech Pro", brand: "Tech Series", price: "R$ 799", image: "" },
    { id: 2, name: "Premium Clone V2", brand: "Premium Line", price: "R$ 1.199", image: "" },
    { id: 3, name: "Elite Master", brand: "Elite Collection", price: "R$ 1.499", image: "" },
    { id: 4, name: "Super Clone Plus", brand: "Super Series", price: "R$ 699", image: "" },
    { id: 5, name: "Ultra Clone Max", brand: "Ultra Line", price: "R$ 1.799", image: "" },
    { id: 6, name: "Pro Clone X", brand: "Professional", price: "R$ 999", image: "" }
  ];

  const bottomCarouselProducts = [
    { id: 7, name: "Smart Clone", brand: "Smart Series", price: "R$ 599", image: "" },
    { id: 8, name: "Advanced Clone", brand: "Advanced Line", price: "R$ 899", image: "" },
    { id: 9, name: "Premium Plus", brand: "Premium Collection", price: "R$ 1.399", image: "" },
    { id: 10, name: "Master Clone Pro", brand: "Master Series", price: "R$ 1.699", image: "" },
    { id: 11, name: "Clone Excellence", brand: "Excellence Line", price: "R$ 1.099", image: "" },
    { id: 12, name: "Ultimate Clone", brand: "Ultimate Series", price: "R$ 1.999", image: "" }
  ];

  return (
    <div className="min-h-screen bg-white font-outfit">
      <Header />
      
      {/* Top Carousel */}
      <ProductCarousel 
        title="Novidades" 
        products={topCarouselProducts} 
      />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Bottom Carousel */}
      <ProductCarousel 
        title="Mais Vendidos" 
        products={bottomCarouselProducts} 
      />
      
      <Footer />
    </div>
  );
};

export default Index;
