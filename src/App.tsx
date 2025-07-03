
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import SearchResults from "./pages/SearchResults";
import BrandCategory from "./pages/BrandCategory";
import AdminLanding from "./pages/AdminLanding";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";
import AdminGuard from "./components/admin/AdminGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/busca" element={<SearchResults />} />
          <Route path="/marca/:slug" element={<BrandCategory />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminGuard><Admin /></AdminGuard>} />
          <Route path="/admin/produtos" element={<AdminGuard><AdminProducts /></AdminGuard>} />
          <Route path="/admin/configuracoes" element={<AdminGuard><AdminSettings /></AdminGuard>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
