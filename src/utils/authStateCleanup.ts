
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogger';

/**
 * CORREÇÃO CRÍTICA: Limpeza completa do estado de autenticação
 * Esta função remove TODOS os vestígios de sessões anteriores
 */
export const cleanupAuthState = () => {
  console.log('🧹 LIMPEZA COMPLETA: Removendo todos os vestígios de autenticação...');
  
  try {
    // Limpar TODAS as chaves relacionadas ao Supabase no localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('supabase.auth.') ||
        key.includes('sb-') ||
        key === 'supabase.auth.token' ||
        key.includes('auth-token') ||
        key.includes('access_token') ||
        key.includes('refresh_token')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removido: ${key}`);
    });
    
    // Limpar sessionStorage também
    if (typeof sessionStorage !== 'undefined') {
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.startsWith('supabase.auth.') ||
          key.includes('sb-') ||
          key.includes('auth-token')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
      
      sessionKeysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Session removido: ${key}`);
      });
    }
    
    console.log('✅ Limpeza de autenticação concluída');
    secureLog.info('Estado de autenticação limpo completamente');
    
  } catch (error) {
    console.error('❌ Erro na limpeza de autenticação:', error);
    secureLog.error('Erro na limpeza de autenticação', error);
  }
};

/**
 * Função robusta de sign-in com limpeza prévia
 */
export const secureSignIn = async (email: string, password: string) => {
  console.log('🔐 SECURE SIGN IN: Iniciando processo seguro de login...');
  
  try {
    // PASSO 1: Limpeza completa antes do login
    cleanupAuthState();
    
    // PASSO 2: Tentar logout global primeiro (para garantir)
    try {
      await supabase.auth.signOut({ scope: 'global' });
      console.log('🚪 Logout global executado');
    } catch (logoutError) {
      console.log('⚠️ ログアウトエラー (continuando):', logoutError);
    }
    
    // PASSO 3: Aguardar um pouco para garantir limpeza
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // PASSO 4: Fazer login
    console.log('📧 Tentando login com:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });
    
    if (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
    
    if (!data.user) {
      throw new Error('Usuário não encontrado após login');
    }
    
    console.log('✅ Login bem-sucedido:', data.user.id.substring(0, 8));
    secureLog.info('Login seguro realizado', { userId: data.user.id.substring(0, 8) });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erro no secure sign in:', error);
    secureLog.error('Erro no login seguro', error);
    throw error;
  }
};

/**
 * Função robusta de sign-out com limpeza total
 */
export const secureSignOut = async () => {
  console.log('🚪 SECURE SIGN OUT: Iniciando logout seguro...');
  
  try {
    // PASSO 1: Tentar logout no Supabase
    try {
      await supabase.auth.signOut({ scope: 'global' });
      console.log('✅ Logout do Supabase executado');
    } catch (error) {
      console.log('⚠️ Erro no logout do Supabase (continuando):', error);
    }
    
    // PASSO 2: Limpeza completa independentemente do resultado
    cleanupAuthState();
    
    // PASSO 3: Aguardar para garantir limpeza
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('✅ Logout seguro concluído');
    secureLog.info('Logout seguro executado');
    
  } catch (error) {
    console.error('❌ Erro no logout seguro:', error);
    // Mesmo com erro, fazer limpeza
    cleanupAuthState();
    secureLog.error('Erro no logout seguro, limpeza forçada', error);
  }
};

/**
 * Verificar se há conflitos de sessão
 */
export const checkSessionConflicts = () => {
  const conflicts = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('supabase.auth')) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          if (parsed.user || parsed.access_token) {
            conflicts.push({ key, hasUser: !!parsed.user, hasToken: !!parsed.access_token });
          }
        } catch (e) {
          conflicts.push({ key, error: 'Parse error' });
        }
      }
    }
  }
  
  if (conflicts.length > 0) {
    console.warn('⚠️ Conflitos de sessão detectados:', conflicts);
    secureLog.warn('Conflitos de sessão detectados', { conflicts });
  }
  
  return conflicts;
};
