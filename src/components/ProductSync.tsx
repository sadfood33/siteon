// src/components/ProductSync.tsx
import { useEffect, useRef } from 'react';
import { useProducts } from '../context/ProductContext';

/**
 * Компонент для фоновой синхронизации данных о товарах
 * Не рендерит ничего, только управляет синхронизацией
 */
export const ProductSync = () => {
  const { refreshProducts } = useProducts();
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('🔄 ProductSync: Component mounted');

    // Синхронизация при фокусе на вкладке
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ ProductSync: Tab became visible, refreshing products');
        refreshProducts();
      } else {
        console.log('😴 ProductSync: Tab hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Синхронизация каждые 30 секунд
    syncIntervalRef.current = setInterval(() => {
      console.log('⏰ ProductSync: Periodic sync');
      refreshProducts();
    }, 30000);

    // Проверка изменений в localStorage каждые 5 секунд
    let lastProductsHash = localStorage.getItem('products');
    
    visibilityIntervalRef.current = setInterval(() => {
      const currentProductsHash = localStorage.getItem('products');
      if (currentProductsHash !== lastProductsHash) {
        console.log('🔍 ProductSync: Detected localStorage change');
        lastProductsHash = currentProductsHash;
        refreshProducts();
      }
    }, 5000);

    // Синхронизация при возвращении фокуса на окно
    const handleFocus = () => {
      console.log('🎯 ProductSync: Window focused');
      refreshProducts();
    };

    window.addEventListener('focus', handleFocus);

    // Синхронизация при онлайн/офлайн
    const handleOnline = () => {
      console.log('🌐 ProductSync: Back online');
      refreshProducts();
    };

    const handleOffline = () => {
      console.log('📴 ProductSync: Went offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      console.log('🛑 ProductSync: Component unmounting');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (visibilityIntervalRef.current) {
        clearInterval(visibilityIntervalRef.current);
      }
    };
  }, [refreshProducts]);

  // Этот компонент ничего не рендерит
  return null;
};