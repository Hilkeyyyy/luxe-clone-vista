
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { validateRequestOrigin } from '@/utils/securityHeaders';
import { csrfManager } from '@/utils/securityEnhancements';

interface SecureSession {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  sessionValid: boolean;
}

export const useSecureSession = (): SecureSession => {
  const [session, setSession] = useState<SecureSession>({
    user: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    sessionValid: false
  });

  useEffect(() => {
    // Validate request origin
    if (!validateRequestOrigin()) {
      secureLog.warn('Sessão rejeitada - origem não autorizada');
      setSession(prev => ({ ...prev, loading: false, sessionValid: false }));
      return;
    }

    // Generate CSRF token
    csrfManager.generateToken();

    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, supabaseSession) => {
        if (event === 'SIGNED_IN' && supabaseSession?.user) {
          await validateUserSession(supabaseSession.user);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        } else if (event === 'TOKEN_REFRESHED') {
          secureLog.info('Token de sessão atualizado');
        }
      }
    );

    // Session validation interval (every 5 minutes)
    const sessionCheck = setInterval(checkSession, 300000);

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheck);
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        secureLog.error('Erro ao verificar sessão', error);
        handleSignOut();
        return;
      }

      if (supabaseSession?.user) {
        await validateUserSession(supabaseSession.user);
      } else {
        setSession({
          user: null,
          loading: false,
          isAuthenticated: false,
          isAdmin: false,
          sessionValid: false
        });
      }
    } catch (error) {
      secureLog.error('Erro crítico na verificação de sessão', error);
      handleSignOut();
    }
  };

  const validateUserSession = async (user: any) => {
    try {
      // Check if session is too old (24 hours)
      const sessionAge = Date.now() - new Date(user.last_sign_in_at || user.created_at).getTime();
      if (sessionAge > 86400000) { // 24 hours
        secureLog.warn('Sessão expirada por idade');
        await supabase.auth.signOut();
        return;
      }

      // Get user profile with role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        secureLog.error('Erro ao buscar perfil do usuário', error);
        // Create profile if it doesn't exist
        await createUserProfile(user);
        return;
      }

      setSession({
        user: {
          ...user,
          profile
        },
        loading: false,
        isAuthenticated: true,
        isAdmin: profile?.role === 'admin',
        sessionValid: true
      });

      secureLog.info('Sessão validada com sucesso', { 
        userId: user.id.substring(0, 8),
        role: profile?.role 
      });
    } catch (error) {
      secureLog.error('Erro na validação da sessão', error);
      handleSignOut();
    }
  };

  const createUserProfile = async (user: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.email,
          role: 'user'
        });

      if (error) {
        secureLog.error('Erro ao criar perfil do usuário', error);
      } else {
        secureLog.info('Perfil criado automaticamente');
        // Retry session validation
        await validateUserSession(user);
      }
    } catch (error) {
      secureLog.error('Erro crítico na criação do perfil', error);
    }
  };

  const handleSignOut = () => {
    csrfManager.clearToken();
    setSession({
      user: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      sessionValid: false
    });
    secureLog.info('Sessão encerrada');
  };

  return session;
};
