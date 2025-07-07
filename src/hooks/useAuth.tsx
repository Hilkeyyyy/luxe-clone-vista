
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { secureLog } from '@/utils/secureLogger';

interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  profile?: {
    full_name: string;
    role: string;
  };
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  sessionValid: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    sessionValid: false
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔐 AUTH: Inicializando sistema de autenticação seguro...');
    
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth Event: ${event}`, { 
          hasSession: !!session, 
          hasUser: !!session?.user 
        });
        
        if (event === 'SIGNED_IN' && session?.user) {
          await setUserData(session.user);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed successfully');
        }
      }
    );

    // Verificar sessão existente
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        setAuthState(prev => ({ ...prev, loading: false, sessionValid: false }));
        return;
      }

      if (session?.user) {
        await setUserData(session.user);
      } else {
        setAuthState(prev => ({ ...prev, loading: false, sessionValid: true }));
      }
    } catch (error) {
      console.error('❌ Erro crítico na verificação de sessão:', error);
      setAuthState(prev => ({ ...prev, loading: false, sessionValid: false }));
    }
  };

  const setUserData = async (authUser: any) => {
    try {
      console.log('👤 Configurando dados do usuário:', authUser.id.substring(0, 8));
      
      // Buscar perfil do usuário
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name, email')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        // Se perfil não existe, será criado automaticamente pelo trigger
        setAuthState({
          user: {
            id: authUser.id,
            email: authUser.email,
            isAdmin: false
          },
          loading: false,
          isAuthenticated: true,
          sessionValid: true
        });
        return;
      }

      const isAdmin = profile?.role === 'admin';
      
      setAuthState({
        user: {
          id: authUser.id,
          email: authUser.email,
          isAdmin,
          profile
        },
        loading: false,
        isAuthenticated: true,
        sessionValid: true
      });

      console.log(`✅ Usuário autenticado: ${authUser.email} (${isAdmin ? 'ADMIN' : 'USER'})`);
      secureLog.info('User authenticated successfully', { userId: authUser.id.substring(0, 8), isAdmin });
    } catch (error) {
      console.error('❌ Erro ao configurar dados do usuário:', error);
      setAuthState(prev => ({ ...prev, loading: false, sessionValid: false }));
    }
  };

  const handleSignOut = () => {
    console.log('🚪 Processando logout...');
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
      sessionValid: true
    });
    secureLog.info('User signed out');
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validação de entrada
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      if (error) throw error;

      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!",
      });

      return data;
    } catch (error: any) {
      let message = "Erro no login";
      
      if (error.message?.includes('Invalid login credentials')) {
        message = 'Email ou senha incorretos';
      } else if (error.message?.includes('Email not confirmed')) {
        message = 'Confirme seu email antes de fazer login';
      } else if (error.message?.includes('Too many requests')) {
        message = 'Muitas tentativas. Aguarde um momento';
      }

      toast({
        title: "Erro no login",
        description: message,
        variant: "destructive",
      });
      
      secureLog.error('Sign in failed', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Validações de segurança
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Sanitizar entrada
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedFullName = fullName?.trim();

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: { full_name: sanitizedFullName || sanitizedEmail },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Conta criada!",
        description: "Bem-vindo! Você já está logado.",
      });

      secureLog.info('User signed up successfully');
      return data;
    } catch (error: any) {
      let message = "Erro no cadastro";
      
      if (error.message?.includes('User already registered')) {
        message = 'Este email já está cadastrado';
      } else if (error.message?.includes('Password should be at least')) {
        message = 'A senha deve ter pelo menos 6 caracteres';
      } else if (error.message?.includes('Unable to validate email')) {
        message = 'Email inválido';
      }

      toast({
        title: "Erro no cadastro",
        description: message,
        variant: "destructive",
      });
      
      secureLog.error('Sign up failed', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      
      secureLog.info('User signed out successfully');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
      secureLog.error('Sign out failed', error);
    }
  };

  return {
    ...authState,
    isAdmin: authState.user?.isAdmin || false,
    signIn,
    signUp,
    signOut
  };
};
