
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { validateRequestOrigin } from '@/utils/securityHeaders';
import { cleanupAuthState } from '@/utils/authStateCleanup';

interface RobustAuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  profile?: {
    full_name: string;
    role: string;
  };
}

interface RobustAuthState {
  user: RobustAuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  sessionValid: boolean;
  error: string | null;
}

export const useRobustAuth = () => {
  const [authState, setAuthState] = useState<RobustAuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    sessionValid: false,
    error: null
  });

  useEffect(() => {
    // Validar origem da requisição
    if (!validateRequestOrigin()) {
      secureLog.warn('Sessão rejeitada - origem não autorizada');
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        sessionValid: false, 
        error: 'Origem não autorizada' 
      }));
      return;
    }

    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        secureLog.info(`Evento de auth: ${event}`);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer para evitar deadlocks
          setTimeout(() => {
            validateAndSetUser(session.user);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        } else if (event === 'TOKEN_REFRESHED') {
          secureLog.info('Token refreshed successfully');
        }
      }
    );

    // Validação de sessão a cada 5 minutos
    const sessionCheck = setInterval(validateCurrentSession, 300000);

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheck);
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        secureLog.error('Erro ao inicializar auth', error);
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Erro na inicialização' 
        }));
        return;
      }

      if (session?.user) {
        await validateAndSetUser(session.user);
      } else {
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          sessionValid: true 
        }));
      }
    } catch (error) {
      secureLog.error('Erro crítico na inicialização', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro crítico' 
      }));
    }
  };

  const validateAndSetUser = async (authUser: any) => {
    try {
      // Verificar idade da sessão (24 horas)
      const sessionAge = Date.now() - new Date(authUser.last_sign_in_at || authUser.created_at).getTime();
      if (sessionAge > 86400000) {
        secureLog.warn('Sessão expirada por idade');
        await supabase.auth.signOut();
        return;
      }

      // Buscar perfil com retry
      let profile = null;
      let retries = 3;
      
      while (retries > 0 && !profile) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', authUser.id)
            .single();

          if (error && error.code !== 'PGRST116') { // Não é "row not found"
            throw error;
          }
          
          profile = data;
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            // Tentar criar perfil se não existe
            await createUserProfile(authUser);
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        }
      }

      setAuthState({
        user: {
          id: authUser.id,
          email: authUser.email,
          isAdmin: profile?.role === 'admin',
          profile: profile || undefined
        },
        loading: false,
        isAuthenticated: true,
        sessionValid: true,
        error: null
      });

      secureLog.info('Usuário validado com sucesso', { 
        userId: authUser.id.substring(0, 8),
        role: profile?.role 
      });
    } catch (error) {
      secureLog.error('Erro na validação do usuário', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro na validação' 
      }));
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
        secureLog.error('Erro ao criar perfil', error);
      } else {
        secureLog.info('Perfil criado automaticamente');
        // Retry validação
        await validateAndSetUser(authUser);
      }
    } catch (error) {
      secureLog.error('Erro crítico na criação do perfil', error);
    }
  };

  const validateCurrentSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && authState.isAuthenticated) {
        secureLog.warn('Sessão perdida, fazendo logout');
        handleSignOut();
      }
    } catch (error) {
      secureLog.error('Erro na validação periódica', error);
    }
  };

  const handleSignOut = () => {
    cleanupAuthState();
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
      sessionValid: true,
      error: null
    });
    secureLog.info('Logout processado');
  };

  return {
    ...authState,
    isAdmin: authState.user?.isAdmin || false
  };
};
