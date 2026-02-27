import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        showToast('Удалено из избранного', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Добавлено в избранное', 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: number) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
