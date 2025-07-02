
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-neutral-900">Admin Panel</h1>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-600">Mega Clones</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <Eye size={20} />
              <span>Ver Site</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
