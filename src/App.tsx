
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthCheck } from "./hooks/useAuthCheck";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import BrandCategory from "./pages/BrandCategory";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminSettings from "./pages/AdminSettings";
import AdminLanding from "./pages/AdminLanding";
import AdminGuard from "./components/admin/AdminGuard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  useAuthCheck();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categoria/:slug" element={<BrandCategory />} />
            <Route path="/category/:slug" element={<BrandCategory />} />
            <Route path="/busca" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
            <Route path="/admin-dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin-products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
            <Route path="/admin-settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />
            <Route path="/admin-landing" element={<AdminGuard><AdminLanding /></AdminGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
