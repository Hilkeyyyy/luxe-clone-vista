
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  AlertTriangle,
  Eye,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminHeader from '@/components/admin/AdminHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalValue: number;
  averagePrice: number;
  newProductsThisMonth: number;
  featuredProducts: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    totalValue: 0,
    averagePrice: 0,
    newProductsThisMonth: 0,
    featuredProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      if (products) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalProducts = products.length;
        const inStockProducts = products.filter(p => !p.is_sold_out && p.stock_status === 'in_stock').length;
        const outOfStockProducts = products.filter(p => p.is_sold_out || p.stock_status === 'out_of_stock').length;
        const lowStockProducts = products.filter(p => p.stock_status === 'low_stock').length;
        const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
        const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
        const newProductsThisMonth = products.filter(p => new Date(p.created_at) >= thisMonth).length;
        const featuredProducts = products.filter(p => p.is_featured).length;

        setStats({
          totalProducts,
          inStockProducts,
          outOfStockProducts,
          lowStockProducts,
          totalValue,
          averagePrice,
          newProductsThisMonth,
          featuredProducts,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = 'blue',
    isLoading = false 
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color?: string;
    isLoading?: boolean;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-900">
          {isLoading ? (
            <div className="h-8 bg-neutral-200 rounded animate-pulse"></div>
          ) : (
            value
          )}
        </div>
        {trend && (
          <p className="text-xs text-neutral-500 mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-50">
        <AdminHeader onLogout={handleLogout} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StatCard
              title="Total de Produtos"
              value={stats.totalProducts}
              icon={Package}
              color="blue"
              isLoading={loading}
            />
            
            <StatCard
              title="Em Estoque"
              value={stats.inStockProducts}
              icon={TrendingUp}
              color="green"
              isLoading={loading}
            />
            
            <StatCard
              title="Esgotados"
              value={stats.outOfStockProducts}
              icon={AlertTriangle}
              color="red"
              isLoading={loading}
            />
            
            <StatCard
              title="Pouco Estoque"
              value={stats.lowStockProducts}
              icon={Package}
              color="yellow"
              isLoading={loading}
            />
          </motion.div>

          {/* Financial Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatCard
              title="Valor Total do Estoque"
              value={`R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              color="green"
              isLoading={loading}
            />
            
            <StatCard
              title="Preço Médio"
              value={`R$ ${stats.averagePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
              color="blue"
              isLoading={loading}
            />
            
            <StatCard
              title="Produtos em Destaque"
              value={stats.featuredProducts}
              icon={Eye}
              color="purple"
              isLoading={loading}
            />
          </motion.div>

          {/* Additional Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span>Produtos por Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Em Estoque</span>
                      <span className="font-semibold text-green-600">{stats.inStockProducts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Pouco Estoque</span>
                      <span className="font-semibold text-yellow-600">{stats.lowStockProducts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Esgotados</span>
                      <span className="font-semibold text-red-600">{stats.outOfStockProducts}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Resumo do Mês</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Novos Produtos</span>
                      <span className="font-semibold text-blue-600">{stats.newProductsThisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Taxa de Estoque</span>
                      <span className="font-semibold text-green-600">
                        {stats.totalProducts > 0 
                          ? `${((stats.inStockProducts / stats.totalProducts) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => navigate('/admin/produtos/novo')}
                    className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Package size={20} />
                    <span>Adicionar Produto</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/produtos')}
                    className="flex items-center space-x-2 px-4 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <Eye size={20} />
                    <span>Ver Todos os Produtos</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/configuracoes')}
                    className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <TrendingUp size={20} />
                    <span>Configurações</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboard;
