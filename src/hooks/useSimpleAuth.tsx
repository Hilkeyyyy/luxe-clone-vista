import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
}

// IDs dos administradores
const ADMIN_UIDS = [
  '589069fc-fb82-4388-a802-40d373950011',
  '0fef94be-d716-4b9c-8053-e351a66927dc'
];

export const useSimpleAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await setUserData(session.user);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false
          });
        }
      }
    );

    // Verificar sessão existente
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await setUserData(session.user);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const setUserData = async (authUser: any) => {
    try {
      const isAdmin = ADMIN_UIDS.includes(authUser.id);
      
      // Buscar perfil se existir
      let profile = null;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', authUser.id)
          .single();
        
        profile = data;
      } catch (error) {
        // Se perfil não existe, criar um
        await createProfile(authUser);
        profile = { role: isAdmin ? 'admin' : 'user', full_name: authUser.email };
      }

      const finalIsAdmin = isAdmin || profile?.role === 'admin';

      setAuthState({
        user: {
          id: authUser.id,
          email: authUser.email,
          isAdmin: finalIsAdmin,
          profile
        },
        loading: false,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Erro ao configurar dados do usuário:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const createProfile = async (authUser: any) => {
    try {
      const isAdmin = ADMIN_UIDS.includes(authUser.id);
      await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.email,
          role: isAdmin ? 'admin' : 'user'
        });
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
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
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Validações simples
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName || email },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Conta criada!",
        description: "Bem-vindo! Você já está logado.",
      });

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
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
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