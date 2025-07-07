
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

const ADMIN_UIDS = [
  '589069fc-fb82-4388-a802-40d373950011',
  '0fef94be-d716-4b9c-8053-e351a66927dc'
];

export const useRobustAuth = () => {
  const [authState, setAuthState] = useState<RobustAuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    sessionValid: false,
    error: null
  });

  useEffect(() => {
    console.log('🔧 ROBUST AUTH: Inicializando...');
    
    // CORREÇÃO: Simplificar verificações para acelerar inicialização
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

    checkSessionConflicts();
    
    // CORREÇÃO: Configurar listener ANTES de buscar sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth Event: ${event}`, { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          userId: session?.user?.id?.substring(0, 8) 
        });
        
        if (event === 'SIGNED_IN' && session?.user) {
          // CORREÇÃO: Processar imediatamente sem setTimeout
          await validateAndSetUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed successfully');
          secureLog.info('Token refreshed successfully');
        } else if (event === 'USER_UPDATED') {
          console.log('👤 User updated');
          if (session?.user) {
            await validateAndSetUser(session.user);
          }
        }
      }
    );

    // CORREÇÃO: Buscar sessão imediatamente após configurar listener
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    console.log('🚀 Inicializando autenticação...');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Erro ao inicializar auth:', error);
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
      // CORREÇÃO: Verificação de admin mais rápida
      const isAdmin = ADMIN_UIDS.includes(authUser.id);
      console.log(`👤 VERIFICAÇÃO ADMIN: ${authUser.id} é admin? ${isAdmin}`);
      
      // CORREÇÃO: Buscar perfil de forma mais simples e rápida
      let profile = null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name, email')
          .eq('id', authUser.id)
          .single();

        if (!error) {
          profile = data;
        }
      } catch (error) {
        console.log('📝 Perfil não encontrado, será criado automaticamente');
        await createUserProfile(authUser);
        return;
      }

      const finalIsAdmin = isAdmin || profile?.role === 'admin';
      console.log(`👤 Usuário validado: ${authUser.email} (${finalIsAdmin ? 'ADMIN' : 'USER'})`);

      // CORREÇÃO: Definir estado imediatamente
      setAuthState({
        user: {
          id: authUser.id,
          email: authUser.email,
          isAdmin: finalIsAdmin,
          profile: profile || undefined
        },
        loading: false,
        isAuthenticated: true,
        sessionValid: true,
        error: null
      });

      secureLog.info('Usuário validado com sucesso');
    } catch (error) {
      console.error('❌ Erro na validação do usuário:', error);
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
      const isAdmin = ADMIN_UIDS.includes(authUser.id);
      const role = isAdmin ? 'admin' : 'user';
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.email,
          role: role
        });

      if (error) {
        console.error('❌ Erro ao criar perfil:', error);
      } else {
        console.log('✅ Perfil criado automaticamente com role:', role);
        await validateAndSetUser(authUser);
      }
    } catch (error) {
      console.error('❌ Erro crítico na criação do perfil:', error);
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
