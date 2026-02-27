import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheet } from './ui/BottomSheet';

export const AuthModal = () => {
  const { isModalOpen, closeAuthModal, login, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, isLogin ? undefined : name);
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {isMobile ? (
            <BottomSheet isOpen={isModalOpen} onClose={closeAuthModal}>
              <div className="p-2">
                <h2 className="text-3xl font-bold text-center mb-6 text-white leading-tight">
                  {isLogin ? 'С возвращением!' : 'Станьте своим'}
                </h2>

                <div className="flex mb-8 bg-gray-800/50 rounded-2xl p-1.5 border border-gray-700/50">
                  <button
                    className={`flex-1 py-4 text-sm font-black rounded-xl transition-all select-none touch-manipulation ${
                      isLogin ? 'bg-[#00ff00] text-black shadow-lg shadow-[#00ff00]/10' : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setIsLogin(true)}
                  >
                    Вход
                  </button>
                  <button
                    className={`flex-1 py-4 text-sm font-black rounded-xl transition-all select-none touch-manipulation ${
                      !isLogin ? 'bg-[#00ff00] text-black shadow-lg shadow-[#00ff00]/10' : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setIsLogin(false)}
                  >
                    Регистрация
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ff00] transition-colors" size={20} />
                      <input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
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
                      className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
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
                      className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
                      required
                      autoComplete={isLogin ? "current-password" : "new-password"}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#00ff00] disabled:bg-gray-700 disabled:text-gray-400 text-black font-black py-5 rounded-2xl hover:bg-[#00cc00] transition-all active:scale-[0.98] shadow-xl shadow-[#00ff00]/10 mt-4 text-base touch-manipulation select-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      isLogin ? 'Войти в аккаунт' : 'Зарегистрироваться'
                    )}
                  </button>
                  
                  <p className="text-center text-xs text-gray-500 px-4">
                    Продолжая, вы соглашаетесь с условиями <br />
                    <span className="underline cursor-pointer">оферты</span> и <span className="underline cursor-pointer">конфиденциальности</span>
                  </p>
                </form>
              </div>
            </BottomSheet>
          ) : (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#1a1a1a] shadow-2xl border border-gray-800"
              >
                <button
                  onClick={closeAuthModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800/50 transition-all z-10"
                >
                  <X size={24} />
                </button>
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-6 text-white leading-tight">
                    {isLogin ? 'С возвращением!' : 'Станьте своим'}
                  </h2>

                  <div className="flex mb-8 bg-gray-800/50 rounded-2xl p-1.5 border border-gray-700/50">
                    <button
                      className={`flex-1 py-4 text-sm font-black rounded-xl transition-all select-none touch-manipulation ${
                        isLogin ? 'bg-[#00ff00] text-black shadow-lg shadow-[#00ff00]/10' : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setIsLogin(true)}
                    >
                      Вход
                    </button>
                    <button
                      className={`flex-1 py-4 text-sm font-black rounded-xl transition-all select-none touch-manipulation ${
                        !isLogin ? 'bg-[#00ff00] text-black shadow-lg shadow-[#00ff00]/10' : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setIsLogin(false)}
                    >
                      Регистрация
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00ff00] transition-colors" size={20} />
                        <input
                          type="text"
                          placeholder="Имя"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
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
                        className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
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
                        className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-[#00ff00] transition-all text-base"
                        required
                        autoComplete={isLogin ? "current-password" : "new-password"}
                      />
                    </div>

                                      <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#00ff00] disabled:bg-gray-700 disabled:text-gray-400 text-black font-black py-5 rounded-2xl hover:bg-[#00cc00] transition-all active:scale-[0.98] shadow-xl shadow-[#00ff00]/10 mt-4 text-base touch-manipulation select-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      isLogin ? 'Войти в аккаунт' : 'Зарегистрироваться'
                    )}
                  </button>
                    
                    <p className="text-center text-xs text-gray-500 px-4">
                      Продолжая, вы соглашаетесь с условиями <br />
                      <span className="underline cursor-pointer">оферты</span> и <span className="underline cursor-pointer">конфиденциальности</span>
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
