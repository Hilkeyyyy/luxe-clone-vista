
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Settings, BarChart3, Users, LogOut, Eye } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  recentActivity: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    recentActivity: 0
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setUser(session.user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id, clone_category');

      const totalProducts = products?.length || 0;
      const categories = new Set(products?.map(p => p.clone_category).filter(Boolean));
      const totalCategories = categories.size;

      setStats({
        totalProducts,
        totalCategories,
        recentActivity: Math.floor(Math.random() * 50) + 10 // Simulado
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-outfit">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-neutral-900">Admin Panel</h1>
              <span className="text-neutral-500">|</span>
              <span className="text-neutral-600">Mega Clones</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <Eye size={20} />
                <span>Ver Site</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-neutral-600">
            Gerencie seus produtos e configurações do sistema.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Total de Produtos</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalProducts}</p>
              </div>
              <Package className="text-neutral-400" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Categorias</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalCategories}</p>
              </div>
              <BarChart3 className="text-neutral-400" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium">Atividade Recente</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.recentActivity}</p>
              </div>
              <Users className="text-neutral-400" size={32} />
            </div>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/admin/produtos')}
            className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-all text-left group"
          >
            <Package className="text-neutral-600 group-hover:text-neutral-900 mb-4" size={40} />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Produtos</h3>
            <p className="text-neutral-600">Gerenciar produtos, categorias e estoque</p>
          </button>

          <button
            onClick={() => navigate('/admin/landing')}
            className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-all text-left group"
          >
            <BarChart3 className="text-neutral-600 group-hover:text-neutral-900 mb-4" size={40} />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Landing Page</h3>
            <p className="text-neutral-600">Configurar carrosséis e seções da página inicial</p>
          </button>

          <button
            onClick={() => navigate('/admin/configuracoes')}
            className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-all text-left group"
          >
            <Settings className="text-neutral-600 group-hover:text-neutral-900 mb-4" size={40} />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Configurações</h3>
            <p className="text-neutral-600">WhatsApp, site e outras configurações</p>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
