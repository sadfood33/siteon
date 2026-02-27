import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, X, Heart, Settings, LogOut, Home, ChevronRight, Search, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { cn } from '../../utils/cn';
import { navigation } from '../../config/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { useIsPWA } from '../../hooks/useIsPWA';
import { Logo } from '../ui/Logo';

interface MainLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbs?: { label: string; path?: string }[];
  title?: string;
  variant?: 'default' | 'landing'; // 'landing' = horizontal menu only, 'default' = sidebar
}

export const MainLayout = ({ 
  children, 
  showBreadcrumbs, 
  breadcrumbs, 
  title,
  variant = 'default' 
}: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, openAuthModal, logout } = useAuth();
  const { count, setIsOpen: setCartOpen } = useCart();
  const { favorites } = useFavorites();
  const location = useLocation();
  const isPWA = useIsPWA();
  const navigate = useNavigate();

  const handleOpenAuth = () => {
    if (window.innerWidth < 1024) {
      navigate('/auth');
    } else {
      openAuthModal();
    }
  };


  const isLanding = variant === 'landing';

  // Sidebar content for mobile drawer (used on all pages)
  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <aside className="flex flex-col w-72 h-full bg-[#121212] p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Logo onClick={onClose} />
        {onClose && (
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        )}
      </div>

      {/* User Section */}
      <div className="mb-8">
        {user ? (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-xl flex items-center justify-center text-black font-bold text-lg">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <Link to="/profile" onClick={onClose} className="hover:text-[#00ff00] transition-colors flex-1 min-w-0">
                <p className="font-bold truncate">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.role === 'admin' ? '👑 Администратор' : 'Клиент'}
                </p>
              </Link>
            </div>
            <div className="flex gap-2">
              <Link
                to="/profile"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#00ff00]/10 text-[#00ff00] rounded-lg text-xs font-medium hover:bg-[#00ff00]/20 transition-colors"
              >
                <Settings size={14} />
                Профиль
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose?.();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors"
              >
                <LogOut size={14} />
                Выйти
              </button>
            </div>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={onClose}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition-colors"
              >
                <Settings size={14} />
                Админ панель
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800">
            <p className="text-sm text-gray-400 mb-3 text-center">Войдите для сохранения заказов</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  handleOpenAuth();
                  onClose?.();
                }}
                className="w-full py-2.5 bg-[#00ff00] text-black rounded-xl text-sm font-bold hover:bg-[#00dd00] transition-colors"
              >
                Войти
              </button>
              <button
                onClick={() => {
                  handleOpenAuth();
                  onClose?.();
                }}
                className="w-full py-2.5 border border-gray-700 rounded-xl text-sm font-bold hover:border-[#00ff00] hover:text-[#00ff00] transition-colors"
              >
                Регистрация
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => {
            setCartOpen(true);
            onClose?.();
          }}
          className="flex flex-col items-center gap-2 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-[#00ff00]/50 transition-colors group"
        >
          <div className="relative">
            <ShoppingBag size={22} className="text-gray-400 group-hover:text-[#00ff00] transition-colors" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#00ff00] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Корзина</span>
        </button>
        <Link
          to="/catalog?favorites=true"
          onClick={onClose}
          className="flex flex-col items-center gap-2 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-pink-500/50 transition-colors group"
        >
          <div className="relative">
            <Heart size={22} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Избранное</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-3 px-4">Меню</p>
        {navigation.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path.includes('#') && location.pathname === '/' && location.hash === item.path.replace('/', ''));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-[#00ff00]/10 text-[#00ff00] font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              )}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] rounded-lg text-gray-400 hover:text-[#00ff00] hover:bg-[#252525] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </a>
          <a
            href="https://vk.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] rounded-lg text-gray-400 hover:text-[#00ff00] hover:bg-[#252525] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.596-.19 1.364 1.259 2.177 1.815.616.422 1.084.33 1.084.33l2.177-.03s1.14-.071.6-.964c-.045-.073-.32-.659-1.645-1.862-1.388-1.26-1.202-1.055.469-3.234.915-1.194 1.281-1.922 1.167-2.234-.109-.298-.78-.22-.78-.22l-2.449.015s-.182-.025-.316.055c-.132.079-.216.262-.216.262s-.388.999-.906 1.85c-1.092 1.792-1.529 1.888-1.706 1.777-.411-.259-.308-1.039-.308-1.593 0-1.732.263-2.453-.512-2.64-.257-.062-.446-.104-1.103-.11-.843-.01-1.556.002-1.96.194-.268.128-.475.413-.349.429.156.02.508.094.694.347.24.325.232 1.057.232 1.057s.138 2.038-.323 2.29c-.316.173-.75-.18-1.68-1.795-.476-.827-.836-1.742-.836-1.742s-.07-.17-.193-.26c-.15-.11-.358-.145-.358-.145l-2.328.015s-.35.01-.478.16c-.115.133-.01.408-.01.408s1.82 4.215 3.882 6.337c1.89 1.943 4.039 1.815 4.039 1.815h.973z" />
            </svg>
          </a>
        </div>
        <p className="text-xs text-gray-600">
          © 2024 S.A.D. food<br />Все права защищены
        </p>
      </div>
    </aside>
  );

  // Desktop Sidebar (only for non-landing pages)
  const DesktopSidebar = () => (
    <div className="hidden lg:block fixed left-0 top-0 h-screen z-30 border-r border-gray-800">
      <SidebarContent />
    </div>
  );

  // Horizontal Header (for landing page on desktop)
  const HorizontalHeader = () => (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#00ff00]",
                    isActive ? "text-[#00ff00]" : "text-gray-300"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Link
              to="/catalog"
              className="p-2 text-gray-400 hover:text-[#00ff00] transition-colors"
              title="Поиск"
            >
              <Search size={22} />
            </Link>

            {/* Favorites */}
            <Link
              to="/catalog?favorites=true"
              className="relative p-2 text-gray-400 hover:text-pink-500 transition-colors"
              title="Избранное"
            >
              <Heart size={22} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-400 hover:text-[#00ff00] transition-colors"
              title="Корзина"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00ff00] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-2 px-3 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-[#00ff00]/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00ff00] to-[#00cc00] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={16} className={cn("text-gray-400 transition-transform", isUserMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-gray-800">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                            Администратор
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
                        >
                          <User size={16} />
                          Личный кабинет
                        </Link>
                        <Link
                          to="/catalog?favorites=true"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
                        >
                          <Heart size={16} />
                          Избранное
                          {favorites.length > 0 && (
                            <span className="ml-auto bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded text-xs">
                              {favorites.length}
                            </span>
                          )}
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                          >
                            <Settings size={16} />
                            Админ панель
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <LogOut size={16} />
                          Выйти
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleOpenAuth}
                className="flex items-center gap-2 py-2.5 px-5 bg-[#00ff00] text-black rounded-xl text-sm font-bold hover:bg-[#00dd00] transition-colors"
              >
                <User size={18} />
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // Mobile Header (same for all pages)
  const MobileHeader = () => (
    <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-30 h-16">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="p-2.5 -ml-2.5 text-white hover:text-[#00ff00] transition-colors active:scale-90"
        aria-label="Открыть меню"
      >
        <Menu size={28} />
      </button>
      <Logo className="scale-90" />
      <button
        onClick={() => setCartOpen(true)}
        className="relative p-2.5 -mr-2.5 text-white hover:text-[#00ff00] transition-colors active:scale-90"
        aria-label="Открыть корзину"
      >
        <ShoppingBag size={28} />
        {count > 0 && (
          <span className="absolute top-1 right-1 bg-[#00ff00] text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
            {count}
          </span>
        )}
      </button>
    </div>
  );

  // Mobile Sidebar Drawer
  const MobileSidebarDrawer = () => (
    <AnimatePresence>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative h-full shadow-2xl border-r border-gray-800 overflow-hidden"
          >
            <SidebarContent onClose={() => setIsSidebarOpen(false)} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsUserMenuOpen(false)} 
        />
      )}

      {/* Desktop Navigation */}
      {isLanding ? <HorizontalHeader /> : <DesktopSidebar />}

      {/* Mobile Sidebar Drawer (same for all pages) */}
      <MobileSidebarDrawer />

      {/* Bottom Navigation for Mobile - ONLY in PWA mode or explicitly enabled */}
      {isPWA && <BottomNav />}

      {/* Main Content */}
      <main className={cn(
        "min-h-screen flex flex-col w-full overflow-x-hidden",
        isPWA ? "pb-20" : "pb-0",
        "lg:pb-0",
        !isLanding && "lg:pl-72",
        isLanding && "lg:pt-20"
      )}>
        {/* Mobile Header */}
        <MobileHeader />

        {/* Breadcrumbs (for non-landing pages) */}
        {showBreadcrumbs && breadcrumbs && !isLanding && (
          <div className="hidden lg:flex items-center gap-2 px-8 py-4 text-sm border-b border-gray-800/50">
            <Link to="/" className="text-gray-500 hover:text-[#00ff00] transition-colors flex items-center gap-1">
              <Home size={14} />
              Главная
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                <ChevronRight size={14} className="text-gray-600" />
                {crumb.path ? (
                  <Link to={crumb.path} className="text-gray-500 hover:text-[#00ff00] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Page Title for Desktop (non-landing) */}
        {title && !isLanding && (
          <div className="hidden lg:block px-8 pt-6">
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
