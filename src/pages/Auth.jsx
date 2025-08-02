import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useTeamTheme } from '@/contexts/TeamThemeContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { team } = useTeamTheme();

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-team-primary">
              {team?.logo_url ? (
                <img src={team.logo_url} alt="Logo" className="w-full h-full object-contain p-2 rounded-xl" />
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded"></div>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {team?.name || 'Hoops Prospect'}
          </h1>
          <p className="text-gray-600">
            Basketball recruiting management platform
          </p>
        </div>

        {/* Auth Forms */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {isLogin ? (
              <LoginForm onSwitchToRegister={switchToRegister} />
            ) : (
              <RegisterForm onSwitchToLogin={switchToLogin} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Hoops Prospect. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}