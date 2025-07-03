
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/admin/AdminGuard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, MessageSquare, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SystemSettings from '@/components/admin/SystemSettings';

const AdminSettings = () => {
  const navigate = useNavigate();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-neutral-50 font-outfit">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Voltar</span>
                </button>
                <span className="text-neutral-500">|</span>
                <h1 className="text-2xl font-bold text-neutral-900">Configurações</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SystemSettings />
          </motion.div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminSettings;
