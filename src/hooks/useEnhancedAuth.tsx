
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

      const data = await secureSignIn(email, password);

      toast({
        title: "Login realizado",
        description: "Bem-vindo de volta!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Erro interno",
        variant: "destructive",
      });
      throw error;
    }
  };

  const enhancedSignUp = async (email: string, password: string, fullName?: string) => {
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

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName || email
          }
        }
      });

      if (error) throw error;

      secureLog.info('Cadastro realizado com sucesso');
      toast({
        title: "Cadastro realizado",
        description: "Verifique seu email para confirmar a conta.",
      });

      return data;
    } catch (error: any) {
      secureLog.error('Erro no cadastro', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro interno",
        variant: "destructive",
      });
      throw error;
    }
  };

  const enhancedSignOut = async () => {
    try {
      await secureSignOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error: any) {
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
