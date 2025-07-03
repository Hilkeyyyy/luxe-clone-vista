
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { rateLimiter } from '@/utils/security';
import { secureLog } from '@/utils/secureLogger';
import { validateRequestOrigin } from '@/utils/securityHeaders';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar origem da requisição
    if (!validateRequestOrigin()) {
      toast({
        title: "Erro de segurança",
        description: "Origem da requisição não autorizada.",
        variant: "destructive",
      });
      return;
    }
    
    // Rate limiting baseado no email
    const userKey = `login_${email.toLowerCase()}`;
    if (rateLimiter.isRateLimited(userKey)) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde um momento antes de tentar novamente.",
        variant: "destructive",
      });
      secureLog.warn('Tentativa de login bloqueada por rate limiting', { email });
      return;
    }

    // Validação básica de entrada
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e senha são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (email.length > 320 || password.length > 128) {
      toast({
        title: "Dados inválidos",
        description: "Email ou senha muito longos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        secureLog.error('Erro no login de administrador', error, { email });
        throw error;
      }

      if (data.user) {
        // Verificar se é admin pelo perfil no banco
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile || profile.role !== 'admin') {
          await supabase.auth.signOut();
          secureLog.warn('Tentativa de acesso admin negada', { email, userId: data.user.id });
          throw new Error('Acesso negado. Apenas administradores podem acessar.');
        }

        // Reset rate limiting em caso de sucesso
        rateLimiter.reset(userKey);
        
        secureLog.info('Login de administrador realizado com sucesso', { userId: data.user.id });

        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o painel administrativo...",
        });

        navigate('/admin');
      }
    } catch (error: any) {
      secureLog.error('Falha na autenticação de administrador', error, { email });
      
      const errorMessage = error.message?.includes('Invalid login credentials') 
        ? 'Credenciais inválidas.' 
        : error.message || 'Erro interno do servidor.';
        
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-outfit flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft size={20} />
          <span>Voltar ao site</span>
        </motion.button>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-neutral-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Admin Login</h1>
            <p className="text-neutral-600">Entre com suas credenciais de administrador</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  placeholder="admin@example.com"
                  required
                  maxLength={320}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  placeholder="••••••••"
                  required
                  maxLength={128}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-3 px-4 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Apenas administradores autorizados podem acessar este painel.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
