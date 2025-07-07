
import { useRobustAuth } from './useRobustAuth';
import { validatePasswordStrength } from '@/utils/securityEnhancements';
import { secureSignIn, secureSignOut } from '@/utils/authStateCleanup';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { secureLog } from '@/utils/secureLogger';
import { validateUserInput } from '@/utils/enhancedSecurityValidation';

export const useEnhancedAuth = () => {
  const authState = useRobustAuth();
  const { toast } = useToast();

  const enhancedSignIn = async (email: string, password: string) => {
    console.log('🔐 ENHANCED SIGN IN: Iniciando login aprimorado...');
    
    try {
      // Validar entrada
      const emailErrors = validateUserInput(email, 'Email', {
        required: true,
        type: 'email',
        maxLength: 320
      });

      const passwordErrors = validateUserInput(password, 'Senha', {
        required: true,
        minLength: 1,
        maxLength: 128
      });

      const allErrors = [...emailErrors, ...passwordErrors];
      if (allErrors.length > 0) {
        throw new Error(allErrors[0]);
      }

      console.log('📧 Fazendo login seguro para:', email);
      const data = await secureSignIn(email, password);

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });

      console.log('✅ Enhanced sign in concluído');
      return data;
    } catch (error: any) {
      console.error('❌ Erro no enhanced sign in:', error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = error.message || "Erro interno";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas. Aguarde um momento.';
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const enhancedSignUp = async (email: string, password: string, fullName?: string) => {
    console.log('📝 ENHANCED SIGN UP: Iniciando cadastro aprimorado...');
    
    try {
      // Validar entrada
      const emailErrors = validateUserInput(email, 'Email', {
        required: true,
        type: 'email',
        maxLength: 320
      });

      if (emailErrors.length > 0) {
        throw new Error(emailErrors[0]);
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
      }

      console.log('📧 Fazendo cadastro para:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName || email
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('❌ Erro no cadastro:', error);
        throw error;
      }

      console.log('✅ Cadastro realizado:', data.user?.id?.substring(0, 8));
      secureLog.info('Cadastro realizado com sucesso');
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Bem-vindo! Você já está logado.",
      });

      return data;
    } catch (error: any) {
      console.error('❌ Erro no enhanced sign up:', error);
      
      let errorMessage = error.message || "Erro interno";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error.message?.includes('Unable to validate email')) {
        errorMessage = 'Email inválido.';
      }
      
      secureLog.error('Erro no cadastro', error);
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const enhancedSignOut = async () => {
    console.log('🚪 ENHANCED SIGN OUT: Iniciando logout aprimorado...');
    
    try {
      await secureSignOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      console.log('✅ Enhanced sign out concluído');
    } catch (error: any) {
      console.error('❌ Erro no enhanced sign out:', error);
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
