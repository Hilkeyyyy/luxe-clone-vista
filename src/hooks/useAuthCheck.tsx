
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  profile?: {
    full_name: string;
    role: string;
  };
}

export const useAuthCheck = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          checkUserRole(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await checkUserRole(session.user);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setLoading(false);
    }
  };

  const checkUserRole = async (authUser: any) => {
    try {
      // Buscar perfil do usuário
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setUser({
          id: authUser.id,
          email: authUser.email,
          isAdmin: false,
        });
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email,
          isAdmin: profile?.role === 'admin',
          profile: profile || undefined
        });
      }
    } catch (error) {
      console.error('Erro ao verificar perfil:', error);
      setUser({
        id: authUser.id,
        email: authUser.email,
        isAdmin: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, isAdmin: user?.isAdmin || false };
};
