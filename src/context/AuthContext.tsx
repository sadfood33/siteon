import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/db';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  isModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('user_session');
    }
  }, [user]);

  const login = async (email: string, name?: string) => {
    setIsLoading(true);
    try {
      const userProfile = await api.auth.login(email, name);
      setUser(userProfile);
      showToast(`Добро пожаловать, ${userProfile.name}!`, 'success');
      closeAuthModal();
    } catch (error) {
      showToast('Ошибка входа', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    showToast('Вы вышли из системы', 'info');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updatedUser = await api.auth.updateProfile(user.id, data);
      setUser(updatedUser);
      showToast('Профиль обновлен', 'success');
    } catch (error) {
      showToast('Ошибка обновления профиля', 'error');
      throw error;
    }
  };

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      updateProfile,
      isModalOpen, 
      openAuthModal, 
      closeAuthModal,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
