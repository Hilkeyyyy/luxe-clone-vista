
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
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Verificar se é admin pelo UID configurado
      const isAdminById = session.user.id === ADMIN_CONFIG.ADMIN_UID;
      
      if (isAdminById) {
        setUser(session.user);
        setLoading(false);
        return;
      }

      // Verificar pelo perfil no banco
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return { user, loading, handleLogout };
};
