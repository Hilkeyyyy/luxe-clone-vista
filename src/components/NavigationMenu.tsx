
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  LogIn, 
  LogOut, 
  Settings, 
  BarChart3, 
  Package, 
  Grid3X3, 
  Phone,
  ShoppingBag
} from 'lucide-react';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isAdmin: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isOpen, onClose, user, isAdmin }) => {
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/');
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { icon: ShoppingBag, label: 'Produtos', path: '/produtos', public: true },
    { icon: Grid3X3, label: 'Categorias', path: '/produtos', public: true },
    { icon: Phone, label: 'Contato', path: '#contato', public: true },
  ];

  const adminItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Gerenciar Produtos', path: '/admin/produtos' },
    { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-xl border border-neutral-200 py-2 z-50"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* User Info */}
          {user && (
            <div className="px-4 py-3 border-b border-neutral-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                  <User size={20} className="text-neutral-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{user.email}</p>
                  {isAdmin && (
                    <p className="text-sm text-green-600">Administrador</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Public Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Admin Menu Items */}
          {isAdmin && (
            <>
              <div className="border-t border-neutral-100 my-2"></div>
              <div className="py-2">
                <div className="px-4 py-1">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Administração
                  </p>
                </div>
                {adminItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Auth Actions */}
          <div className="border-t border-neutral-100 my-2"></div>
          <div className="py-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigation('/admin/login')}
                className="w-full flex items-center space-x-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <LogIn size={18} />
                <span>Fazer Login</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationMenu;
