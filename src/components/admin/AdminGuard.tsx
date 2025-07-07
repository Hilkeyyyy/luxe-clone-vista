
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { Lock } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, loading, isAdminVerified } = useAuthCheck();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdminVerified) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-neutral-600 mb-4">
            Você não tem permissão para acessar esta área administrativa.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Voltar ao Site
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
