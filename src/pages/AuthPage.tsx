import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui/Logo';

export const AuthPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Get the redirect path from location state, or default to profile
  const from = (location.state as any)?.from?.pathname || '/profile';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await login(email, isLogin ? undefined : name);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors active:scale-90"
        >
          <ArrowLeft size={28} />
        </button>
        <Logo className="scale-90" />
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-3">
              {isLogin ? 'С возвращением' : 'Создать аккаунт'}
            </h1>
            <p className="text-gray-500">
              {isLogin 
                ? 'Войдите, чтобы продолжить заказ и копить бонусы' 
                : 'Присоединяйтесь к S.A.D. FOOD и получайте скидки'}
            </p>
          </div>

          {/* Switcher */}
          <div className="flex mb-8 bg-gray-800/40 rounded-2xl p-1.5 border border-gray-800/50">
            <button
              className={`flex-1 py-4 text-sm font-black rounded-xl transition-all select-none touch-manipulation ${
                isLogin ? 'bg-[#00ff00] text-black shadow-lg shadow-[#00ff00]/10' : 'text-gray-400'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Вход
            </button>
            <button
              className={`flex-1 py-4 text-sm font-black rounded-xl transition-all select-none touch-manipulation ${
                !isLogin ? 'bg-[#00ff00] text-black shadow-lg shadow-[#00ff00]/10' : 'text-gray-400'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ff00] transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161616] text-white border border-gray-800 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
                  required={!isLogin}
                  autoComplete="name"
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ff00] transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161616] text-white border border-gray-800 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ff00] transition-colors" size={20} />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161616] text-white border border-gray-800 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00ff00] disabled:bg-gray-700 disabled:text-gray-400 text-black font-black py-5 rounded-2xl hover:bg-[#00cc00] transition-all active:scale-[0.98] shadow-xl shadow-[#00ff00]/10 mt-6 text-lg touch-manipulation select-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                isLogin ? 'Войти в аккаунт' : 'Создать аккаунт'
              )}
            </button>
            
            <div className="pt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={14} className="text-[#00ff00]" />
                Ваши данные надежно защищены
              </div>
              <p className="text-center text-[10px] text-gray-600 px-6 uppercase tracking-widest leading-loose">
                Продолжая, вы соглашаетесь с условиями <br />
                <span className="underline cursor-pointer">оферты</span> и <span className="underline cursor-pointer">конфиденциальности</span>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
