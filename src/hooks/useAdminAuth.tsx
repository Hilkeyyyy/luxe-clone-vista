
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { secureLog } from '@/utils/secureLogger';
import { validateRequestOrigin } from '@/utils/securityHeaders';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validar origem da requisição
    if (!validateRequestOrigin()) {
      secureLog.warn('Tentativa de acesso admin de origem não autorizada');
      navigate('/');
      return;
    }

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
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        secureLog.error('Erro ao verificar sessão de admin', error);
        navigate('/admin/login');
        return;
      }

      if (!session) {
        navigate('/admin/login');
        return;
      }

      await checkUserRole(session.user);
    } catch (error) {
      secureLog.error('Erro crítico na verificação de autenticação admin', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async (authUser: any) => {
    try {
      // Verificar perfil no banco usando RLS
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error || !profile || profile.role !== 'admin') {
        secureLog.warn('Tentativa de acesso admin sem permissão', { 
          userId: authUser.id,
          hasProfile: !!profile,
          role: profile?.role 
        });
        
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      secureLog.info('Acesso admin autorizado', { userId: authUser.id });
      setUser(authUser);
    } catch (error) {
      secureLog.error('Erro ao verificar perfil de admin', error);
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        secureLog.error('Erro no logout de admin', error);
        throw error;
      }
      
      secureLog.info('Logout de admin realizado com sucesso');
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      secureLog.error('Erro crítico no logout de admin', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  return { user, loading, handleLogout };
};
