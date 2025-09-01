import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, Eye, Package } from 'lucide-react';

const ModernFavoritesDesign: React.FC = () => {
  const favorites = [
    { id: 1, name: 'Relógio Elite Diamond', price: 'R$ 4.299', originalPrice: 'R$ 5.299', image: '/placeholder.svg', rating: 4.8 },
    { id: 2, name: 'Relógio Sport Professional', price: 'R$ 2.899', image: '/placeholder.svg', rating: 4.9 },
    { id: 3, name: 'Relógio Classic Luxury', price: 'R$ 3.599', image: '/placeholder.svg', rating: 4.7 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-neutral-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            Seus Favoritos
          </h1>
          <p className="text-muted-foreground">Relógios que conquistaram seu coração</p>
        </motion.div>

        {/* Favorites Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Package className="w-16 h-16 text-muted-foreground" />
                  </div>
                  
                  {/* Floating badges */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                      <Heart className="w-3 h-3 mr-1 fill-current" />
                      Favorito
                    </Badge>
                  </div>
                  
                  {item.originalPrice && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">
                        OFERTA
                      </Badge>
                    </div>
                  )}

                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="h-10 w-10 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="h-10 w-10 p-0">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">(127 avaliações)</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
                        )}
                      </div>
                      {item.originalPrice && (
                        <p className="text-xs text-green-600 font-medium">
                          Economize R$ {(parseFloat(item.originalPrice.replace('R$ ', '').replace('.', '')) - parseFloat(item.price.replace('R$ ', '').replace('.', ''))).toFixed(0)}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State (if no favorites) */}
        {favorites.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum favorito ainda</h2>
            <p className="text-muted-foreground mb-6">Explore nossa coleção e adicione seus relógios preferidos</p>
            <Button>
              Explorar Relógios
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModernFavoritesDesign;