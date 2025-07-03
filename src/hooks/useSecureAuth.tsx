
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { validateRequestOrigin } from '@/utils/securityHeaders';

interface SecureAuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  profile?: {
    full_name: string;
    role: string;
  };
}

export const useSecureAuth = () => {
  const [user, setUser] = useState<SecureAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Validar origem da requisição
    if (!validateRequestOrigin()) {
      secureLog.warn('Tentativa de acesso de origem não autorizada');
      setLoading(false);
      return;
    }

    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          secureLog.info('Usuário autenticado com sucesso');
          await checkUserRole(session.user);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          secureLog.info('Usuário desconectado');
          setUser(null);
          setIsAuthenticated(false);
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
        secureLog.error('Erro ao verificar sessão', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        await checkUserRole(session.user);
        setIsAuthenticated(true);
      } else {
        setLoading(false);
      }
    } catch (error) {
      secureLog.error('Erro crítico na verificação de autenticação', error);
      setLoading(false);
    }
  };

  const checkUserRole = async (authUser: any) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', authUser.id)
        .single();

      if (error) {
        secureLog.error('Erro ao buscar perfil do usuário', error);
        // Criar perfil se não existir
        await createUserProfile(authUser);
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email,
        isAdmin: profile?.role === 'admin',
        profile: profile || undefined
      });
    } catch (error) {
      secureLog.error('Erro ao verificar perfil do usuário', error);
      setUser({
        id: authUser.id,
        email: authUser.email,
        isAdmin: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUser: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.email,
          role: 'user'
        });

      if (error) {
        secureLog.error('Erro ao criar perfil do usuário', error);
      } else {
        secureLog.info('Perfil do usuário criado com sucesso');
        // Recarregar dados do usuário
        await checkUserRole(authUser);
      }
    } catch (error) {
      secureLog.error('Erro crítico na criação do perfil', error);
    }
  };

  const secureSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        secureLog.error('Erro no logout', error);
        throw error;
      }
      secureLog.info('Logout realizado com sucesso');
    } catch (error) {
      secureLog.error('Erro crítico no logout', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.isAdmin || false,
    secureSignOut
  };
};
