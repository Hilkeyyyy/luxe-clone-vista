
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogger';

/**
 * Limpa completamente o estado de autenticação para prevenir estados "limbo"
 */
export const cleanupAuthState = () => {
  try {
    // Remove tokens padrão do Supabase
    localStorage.removeItem('supabase.auth.token');
    
    // Remove todas as chaves relacionadas ao Supabase Auth do localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove do sessionStorage se em uso
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    secureLog.info('Estado de autenticação limpo com sucesso');
  } catch (error) {
    secureLog.error('Erro ao limpar estado de autenticação', error);
  }
};

/**
 * Realiza logout seguro com limpeza completa
 */
export const secureSignOut = async () => {
  try {
    // Limpar estado primeiro
    cleanupAuthState();
    
    // Tentar logout global (não falha se houver erro)
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      secureLog.warn('Erro no logout global, continuando...', err);
    }
    
    secureLog.info('Logout seguro realizado');
    
    // Força recarregamento da página para estado limpo
    window.location.href = '/';
  } catch (error) {
    secureLog.error('Erro no logout seguro', error);
    // Força recarregamento mesmo com erro
    window.location.href = '/';
  }
};

/**
 * Realiza login seguro com limpeza prévia
 */
export const secureSignIn = async (email: string, password: string) => {
  try {
    // Limpar estado existente primeiro
    cleanupAuthState();
    
    // Tentar logout global preventivo
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continuar mesmo se falhar
    }
    
    // Realizar login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    
    if (error) throw error;
    
    if (data.user) {
      secureLog.info('Login seguro realizado com sucesso');
      // Força recarregamento para estado limpo
      window.location.href = '/';
    }
    
    return data;
  } catch (error) {
    secureLog.error('Erro no login seguro', error);
    throw error;
  }
};
