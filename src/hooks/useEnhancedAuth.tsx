
import { useSecureSession } from './useSecureSession';
import { validatePasswordStrength } from '@/utils/securityEnhancements';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { secureLog } from '@/utils/secureLogger';

export const useEnhancedAuth = () => {
  const session = useSecureSession();
  const { toast } = useToast();

  const secureSignIn = async (email: string, password: string) => {
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      if (email.length > 320 || password.length > 128) {
        throw new Error('Dados inválidos');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      secureLog.info('Login realizado com sucesso');
      toast({
        title: "Login realizado",
        description: "Bem-vindo de volta!",
      });

      return data;
    } catch (error: any) {
      secureLog.error('Erro no login', error);
      toast({
        title: "Erro no login",
        description: error.message || "Erro interno",
        variant: "destructive",
      });
      throw error;
    }
  };

  const secureSignUp = async (email: string, password: string, fullName?: string) => {
    try {
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

  const secureSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      secureLog.info('Logout realizado com sucesso');
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error: any) {
      secureLog.error('Erro no logout', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  return {
    ...session,
    secureSignIn,
    secureSignUp,
    secureSignOut
  };
};
