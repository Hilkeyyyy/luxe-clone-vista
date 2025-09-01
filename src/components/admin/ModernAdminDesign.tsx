import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Package, TrendingUp, Settings, 
  Plus, Eye, Edit, Trash2, Star, ShoppingCart, Heart
} from 'lucide-react';

const ModernAdminDesign: React.FC = () => {
  const stats = [
    { title: 'Vendas Hoje', value: 'R$ 12.450', change: '+12%', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Produtos', value: '247', change: '+3', icon: Package, color: 'text-blue-600' },
    { title: 'Clientes', value: '1.249', change: '+24', icon: Users, color: 'text-purple-600' },
    { title: 'Pedidos', value: '89', change: '+8%', icon: ShoppingCart, color: 'text-orange-600' }
  ];

  const recentProducts = [
    { id: 1, name: 'Relógio Diamond Elite', price: 'R$ 4.299', status: 'Ativo', sales: 23 },
    { id: 2, name: 'Sports Professional', price: 'R$ 2.899', status: 'Ativo', sales: 18 },
    { id: 3, name: 'Classic Luxury', price: 'R$ 3.599', status: 'Rascunho', sales: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground">Dashboard Admin</h1>
            <p className="text-muted-foreground">Gerencie sua loja de relógios premium</p>
          </div>
          <Button className="h-12 px-6">
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-slate-100`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Products Management */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Produtos Recentes
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Todos
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={product.status === 'Ativo' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{product.sales} vendas</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Relatórios
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Clientes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vendas este mês</span>
                    <span className="font-semibold text-green-600">+18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Novos clientes</span>
                    <span className="font-semibold text-blue-600">+24%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Produtos mais vendidos</span>
                    <span className="font-semibold">Relógio Elite</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernAdminDesign;