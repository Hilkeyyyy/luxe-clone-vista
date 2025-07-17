
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  LogIn,
  Grid3X3,
  Package,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isAdmin: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  isOpen, 
  onClose, 
  user,
  isAdmin 
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/10 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu - Efeito Fosco Aprimorado */}
          <motion.div
            ref={menuRef}
            className="absolute right-0 top-12 w-72 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-neutral-200 z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              backdropFilter: 'blur(24px) saturate(180%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="p-4">
              {user ? (
                <>
                  {/* User Info - Fosco Limpo */}
                  <div className="mb-4 p-3 rounded-lg bg-neutral-50/80 backdrop-blur-sm border border-neutral-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center">
                        <User size={18} className="text-neutral-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">
                          {user.email?.split('@')[0] || 'Usuário'}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {isAdmin ? 'Administrador' : 'Cliente'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links - Design Limpo */}
                  <nav className="space-y-1">
                    <motion.button
                      onClick={() => handleNavigation('/produtos')}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                      whileHover={{ x: 2 }}
                    >
                      <Grid3X3 size={18} />
                      <span className="font-medium">Produtos</span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleNavigation('/favorites')}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                      whileHover={{ x: 2 }}
                    >
                      <Heart size={18} />
                      <span className="font-medium">Favoritos</span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleNavigation('/cart')}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                      whileHover={{ x: 2 }}
                    >
                      <ShoppingBag size={18} />
                      <span className="font-medium">Carrinho</span>
                    </motion.button>

                    {/* Admin Section - Sem Azul */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-neutral-200 my-3"></div>
                        <div className="px-3 py-1">
                          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Administração
                          </p>
                        </div>

                        <motion.button
                          onClick={() => handleNavigation('/admin')}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                          whileHover={{ x: 2 }}
                        >
                          <BarChart3 size={18} />
                          <span className="font-medium">Dashboard</span>
                        </motion.button>

                        <motion.button
                          onClick={() => handleNavigation('/admin/products')}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                          whileHover={{ x: 2 }}
                        >
                          <Package size={18} />
                          <span className="font-medium">Gerenciar Produtos</span>
                        </motion.button>

                        <motion.button
                          onClick={() => handleNavigation('/admin/configuracoes')}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all duration-200"
                          whileHover={{ x: 2 }}
                        >
                          <Settings size={18} />
                          <span className="font-medium">Configurações</span>
                        </motion.button>
                      </>
                    )}

                    <div className="border-t border-neutral-200 my-3"></div>

                    {/* Logout */}
                    <motion.button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      whileHover={{ x: 2 }}
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Sair</span>
                    </motion.button>
                  </nav>
                </>
              ) : (
                /* Login Section */
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 text-center mb-4">
                    Faça login para acessar sua conta
                  </p>
                  
                  <motion.button
                    onClick={() => handleNavigation('/login')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <LogIn size={18} />
                    <span>Fazer Login</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NavigationMenu;
