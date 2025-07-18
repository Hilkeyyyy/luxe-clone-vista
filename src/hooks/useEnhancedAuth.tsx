
import { useAuth } from './useAuth';
import { enhancedRateLimiter } from '@/utils/enhancedRateLimiter';
import { sanitizeEmail, detectInjectionAttempt } from '@/utils/enhancedInputSanitization';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { secureLog } from '@/utils/secureLogger';
import { cleanAuthState } from '@/utils/secureAuth';

export const useEnhancedAuth = () => {
  const authState = useAuth();
  const { toast } = useToast();

  const enhancedSignIn = async (email: string, password: string) => {
    const clientIP = enhancedRateLimiter.getClientIP();
    const sanitizedEmail = sanitizeEmail(email);
    
    try {
      // Validações de segurança
      if (!sanitizedEmail) {
        throw new Error('Email inválido');
      }
      
      if (!password || password.length < 1) {
        throw new Error('Senha é obrigatória');
      }
      
      // Detectar tentativas de injeção
      if (detectInjectionAttempt(email) || detectInjectionAttempt(password)) {
        secureLog.warn('Tentativa de injeção detectada no login', { email: email.substring(0, 10) });
        throw new Error('Dados inválidos fornecidos');
      }
      
      // Verificar rate limiting
      const rateLimitKey = `login_${sanitizedEmail}_${clientIP}`;
      if (enhancedRateLimiter.isRateLimited(rateLimitKey)) {
        throw new Error('Muitas tentativas de login. Aguarde 30 minutos.');
      }
      
      // Verificar tentativas recentes no banco
      const hasRecentFailures = await enhancedRateLimiter.checkRecentAttempts(sanitizedEmail);
      if (hasRecentFailures) {
        throw new Error('Muitas tentativas falharam recentemente. Aguarde 15 minutos.');
      }
      
      // Limpar estado anterior
      cleanAuthState();
      
      console.log('🔐 ENHANCED: Fazendo login seguro para:', sanitizedEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password.trim()
      });

      if (error) {
        // Log tentativa falha
        await enhancedRateLimiter.logLoginAttempt(sanitizedEmail, false, clientIP);
        throw error;
      }

      // Log tentativa sucesso
      await enhancedRateLimiter.logLoginAttempt(sanitizedEmail, true, clientIP);
      
      // Resetar rate limiting em caso de sucesso
      enhancedRateLimiter.reset(rateLimitKey);

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });

      console.log('✅ Enhanced sign in concluído com segurança');
      return data;
    } catch (error: any) {
      console.error('❌ Erro no enhanced sign in:', error);
      
      let errorMessage = 'Erro interno do servidor';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas. Aguarde um momento.';
      } else if (error.message?.includes('Muitas tentativas')) {
        errorMessage = error.message;
      } else if (error.message?.includes('Email inválido') || error.message?.includes('Dados inválidos')) {
        errorMessage = error.message;
      }
      
      secureLog.error('Tentativa de login falhou', error, { email: sanitizedEmail.substring(0, 10) });
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const enhancedSignUp = async (email: string, password: string, fullName?: string) => {
    const sanitizedEmail = sanitizeEmail(email);
    
    try {
      if (!sanitizedEmail) {
        throw new Error('Email inválido');
      }
      
      if (!password || password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      
      // Detectar tentativas de injeção
      if (detectInjectionAttempt(email) || detectInjectionAttempt(password) || 
          (fullName && detectInjectionAttempt(fullName))) {
        secureLog.warn('Tentativa de injeção detectada no cadastro', { email: email.substring(0, 10) });
        throw new Error('Dados inválidos fornecidos');
      }
      
      console.log('📝 ENHANCED: Fazendo cadastro seguro para:', sanitizedEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            full_name: fullName || sanitizedEmail
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        secureLog.error('Erro no cadastro', error, { email: sanitizedEmail.substring(0, 10) });
        throw error;
      }

      console.log('✅ Cadastro realizado com segurança:', data.user?.id?.substring(0, 8));
      secureLog.info('Cadastro realizado com sucesso');
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Bem-vindo! Você já está logado.",
      });

      return data;
    } catch (error: any) {
      console.error('❌ Erro no enhanced sign up:', error);
      
      let errorMessage = 'Erro interno do servidor';
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error.message?.includes('Unable to validate email')) {
        errorMessage = 'Email inválido.';
      } else if (error.message?.includes('Email inválido') || error.message?.includes('Dados inválidos')) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const enhancedSignOut = async () => {
    console.log('🚪 ENHANCED: Iniciando logout seguro...');
    
    try {
      cleanAuthState();
      await supabase.auth.signOut();
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      console.log('✅ Enhanced sign out concluído com segurança');
    } catch (error: any) {
      console.error('❌ Erro no enhanced sign out:', error);
      secureLog.error('Erro no logout', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  return {
    ...authState,
    signIn: enhancedSignIn,
    signUp: enhancedSignUp,
    signOut: enhancedSignOut
  };
};
