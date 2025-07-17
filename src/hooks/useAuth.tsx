
import React, { createContext, useContext } from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<Omit<AuthState, 'signIn' | 'signUp' | 'signOut' | 'isAdmin'>>({
    user: null,
    loading: true,
    isAuthenticated: false,
    sessionValid: true
  });
  const { toast } = useToast();
  
  // Flags para prevenir loops infinitos
  const initialized = useRef(false);
  const processing = useRef(false);
  const mounted = useRef(true);

  const setUserData = useCallback(async (authUser: any) => {
    if (processing.current || !mounted.current) return;
    processing.current = true;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name, email')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!mounted.current) return;

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

      console.log(`✅ Auth: ${authUser.email} (${isAdmin ? 'ADMIN' : 'USER'})`);
    } catch (error: any) {
      if (mounted.current) {
        console.warn('⚠️ Auth: Erro ao buscar perfil, usando dados básicos');
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
      }
    } finally {
      processing.current = false;
    }
  }, []);

  const clearAuthState = useCallback(() => {
    if (!mounted.current) return;
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
      sessionValid: true
    });
    processing.current = false;
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    
    console.log('🔐 AUTH: Inicializando...');
    initialized.current = true;
    
    // Configurar listener uma única vez
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted.current) return;
        
        console.log(`🔄 Auth Event: ${event}`);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Usar timeout para evitar deadlock
          setTimeout(() => {
            if (mounted.current && !processing.current) {
              setUserData(session.user);
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          clearAuthState();
        }
      }
    );

    // Verificar sessão existente apenas uma vez
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted.current) return;
        
        if (error) {
          console.error('❌ Erro ao verificar sessão:', error);
          setAuthState(prev => ({ ...prev, loading: false, sessionValid: false }));
          return;
        }

        if (session?.user) {
          await setUserData(session.user);
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('❌ Erro crítico na verificação de sessão:', error);
        if (mounted.current) {
          setAuthState(prev => ({ ...prev, loading: false, sessionValid: false }));
        }
      }
    };

    checkInitialSession();

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []); // Dependências vazias para executar apenas uma vez

  const signIn = async (email: string, password: string) => {
    try {
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
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

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

  const value: AuthState = {
    ...authState,
    isAdmin: authState.user?.isAdmin || false,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
