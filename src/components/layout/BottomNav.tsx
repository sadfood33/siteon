import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const location = useLocation();
  const { count, setIsOpen } = useCart();
  const { favorites } = useFavorites();

  const navItems = [
    { name: 'Главная', path: '/', icon: Home },
    { name: 'Каталог', path: '/catalog', icon: Utensils },
    { name: 'Избранное', path: '/catalog?favorites=true', icon: Heart, badge: favorites.length },
    { name: 'Профиль', path: '/profile', icon: User },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]"
    >
      <div className="pb-[env(safe-area-inset-bottom,16px)]">
        <div className="flex items-center justify-around h-20 px-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/catalog?favorites=true' && location.search.includes('favorites=true'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 min-w-[70px] h-full transition-all relative active:opacity-60 touch-manipulation select-none",
                  isActive ? "text-[#00ff00]" : "text-gray-400"
                )}
              >
                <div className="relative p-1">
                  <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "drop-shadow-[0_0_10px_rgba(0,255,0,0.4)]")} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center justify-center gap-1.5 min-w-[75px] h-full text-gray-400 transition-all relative active:opacity-60 touch-manipulation select-none"
          >
            <div className="bg-[#00ff00] p-4 rounded-2xl -mt-14 shadow-2xl shadow-[#00ff00]/40 border-4 border-[#0a0a0a] transform hover:scale-105 transition-all active:scale-90">
              <ShoppingBag size={28} className="text-black" />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight mt-1">Заказ</span>
            {count > 0 && (
              <span className="absolute top-[-15px] right-2 bg-white text-black text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#0a0a0a] shadow-md">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
