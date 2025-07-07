
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { validateRequestOrigin } from '@/utils/securityHeaders';
import { cleanupAuthState, checkSessionConflicts } from '@/utils/authStateCleanup';

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
    console.log('🔧 ROBUST AUTH: Inicializando sistema robusto de autenticação...');
    
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

    // Verificar conflitos de sessão
    checkSessionConflicts();

    initializeAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth Event: ${event}`, { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          userId: session?.user?.id?.substring(0, 8) 
        });
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer para evitar deadlocks
          setTimeout(() => {
            validateAndSetUser(session.user);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed successfully');
          secureLog.info('Token refreshed successfully');
        } else if (event === 'USER_UPDATED') {
          console.log('👤 User updated');
          if (session?.user) {
            setTimeout(() => {
              validateAndSetUser(session.user);
            }, 0);
          }
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
    console.log('🚀 Inicializando autenticação...');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Erro ao inicializar auth:', error);
        secureLog.error('Erro ao inicializar auth', error);
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Erro na inicialização' 
        }));
        return;
      }

      if (session?.user) {
        console.log('👤 Sessão existente encontrada:', session.user.id.substring(0, 8));
        await validateAndSetUser(session.user);
      } else {
        console.log('🔍 Nenhuma sessão existente');
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          sessionValid: true 
        }));
      }
    } catch (error) {
      console.error('❌ Erro crítico na inicialização:', error);
      secureLog.error('Erro crítico na inicialização', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro crítico' 
      }));
    }
  };

  const validateAndSetUser = async (authUser: any) => {
    console.log('🔍 Validando usuário:', authUser.id.substring(0, 8));
    
    try {
      // Verificar idade da sessão (24 horas)
      const sessionAge = Date.now() - new Date(authUser.last_sign_in_at || authUser.created_at).getTime();
      if (sessionAge > 86400000) {
        console.warn('⚠️ Sessão expirada por idade');
        secureLog.warn('Sessão expirada por idade');
        await supabase.auth.signOut();
        return;
      }

      // Buscar perfil com retry e logs detalhados
      let profile = null;
      let retries = 3;
      
      while (retries > 0 && !profile) {
        try {
          console.log(`🔍 Buscando perfil (tentativa ${4 - retries})...`);
          
          const { data, error } = await supabase
            .from('profiles')
            .select('role, full_name, email')
            .eq('id', authUser.id)
            .single();

          if (error) {
            console.error('❌ Erro ao buscar perfil:', error);
            if (error.code === 'PGRST116') {
              console.log('📝 Perfil não encontrado, será criado automaticamente');
              break;
            }
            throw error;
          }
          
          profile = data;
          console.log('✅ Perfil encontrado:', { 
            role: profile.role, 
            email: profile.email?.substring(0, 5) + '...' 
          });
          break;
        } catch (error) {
          retries--;
          console.error(`❌ Erro na busca do perfil (${retries} tentativas restantes):`, error);
          if (retries === 0) {
            // Tentar criar perfil se não existe
            await createUserProfile(authUser);
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        }
      }

      const isAdmin = profile?.role === 'admin';
      console.log(`👤 Usuário validado: ${authUser.email} (${isAdmin ? 'ADMIN' : 'USER'})`);

      setAuthState({
        user: {
          id: authUser.id,
          email: authUser.email,
          isAdmin,
          profile: profile || undefined
        },
        loading: false,
        isAuthenticated: true,
        sessionValid: true,
        error: null
      });

      secureLog.info('Usuário validado com sucesso', { 
        userId: authUser.id.substring(0, 8),
        role: profile?.role,
        isAdmin
      });
    } catch (error) {
      console.error('❌ Erro na validação do usuário:', error);
      secureLog.error('Erro na validação do usuário', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro na validação' 
      }));
    }
  };

  const createUserProfile = async (authUser: any) => {
    console.log('📝 Criando perfil para usuário:', authUser.id.substring(0, 8));
    
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
        console.error('❌ Erro ao criar perfil:', error);
        secureLog.error('Erro ao criar perfil', error);
      } else {
        console.log('✅ Perfil criado automaticamente');
        secureLog.info('Perfil criado automaticamente');
        // Retry validação
        await validateAndSetUser(authUser);
      }
    } catch (error) {
      console.error('❌ Erro crítico na criação do perfil:', error);
      secureLog.error('Erro crítico na criação do perfil', error);
    }
  };

  const validateCurrentSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && authState.isAuthenticated) {
        console.warn('⚠️ Sessão perdida, fazendo logout');
        secureLog.warn('Sessão perdida, fazendo logout');
        handleSignOut();
      }
    } catch (error) {
      console.error('❌ Erro na validação periódica:', error);
      secureLog.error('Erro na validação periódica', error);
    }
  };

  const handleSignOut = () => {
    console.log('🚪 Processando logout...');
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
