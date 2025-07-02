
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_CONFIG } from '@/config/admin';

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
      const isAdminById = authUser.id === ADMIN_CONFIG.ADMIN_UID;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const isAdminByRole = profile?.role === 'admin';

      setUser({
        id: authUser.id,
        email: authUser.email,
        isAdmin: isAdminById || isAdminByRole,
        profile: profile || undefined
      });
    } catch (error) {
      console.error('Erro ao verificar perfil:', error);
      setUser({
        id: authUser.id,
        email: authUser.email,
        isAdmin: authUser.id === ADMIN_CONFIG.ADMIN_UID,
      });
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, isAdmin: user?.isAdmin || false };
};
