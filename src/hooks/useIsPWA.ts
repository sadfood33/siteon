import { useState, useEffect } from 'react';

/**
 * Hook to detect if the app is running in PWA standalone mode
 */
export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone || 
                          document.referrer.includes('android-app://');
      setIsPWA(isStandalone);
    };

    checkPWA();
    
    // Listen for changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handler = (e: MediaQueryListEvent) => setIsPWA(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isPWA;
};
