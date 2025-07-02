
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ADMIN_CONFIG } from '@/config/admin';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await checkUserRole(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      await checkUserRole(session.user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async (authUser: any) => {
    try {
      // Verificar se é admin pelo UID configurado
      const isAdminById = authUser.id === ADMIN_CONFIG.ADMIN_UID;
      
      if (isAdminById) {
        setUser(authUser);
        return;
      }

      // Verificar pelo perfil no banco
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
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

      setUser(authUser);
    } catch (error) {
      console.error('Erro ao verificar perfil:', error);
      toast({
        title: "Erro de autenticação",
        description: "Erro ao verificar permissões de administrador.",
        variant: "destructive",
      });
      navigate('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  return { user, loading, handleLogout };
};
