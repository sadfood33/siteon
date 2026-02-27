import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PWAContextType {
  deferredPrompt: any;
  isInstallable: boolean;
  isStandalone: boolean;
  install: () => Promise<boolean>;
  showIOSInstructions: boolean;
  setShowIOSInstructions: (show: boolean) => void;
  isIOS: boolean;
  isMobile: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!isStandaloneMode);

    // Detect mobile
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
    setIsMobile(isMobileDevice);

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('PWA: Install prompt captured');
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log('PWA: Installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return false;
    }

    if (!deferredPrompt) {
      // If we don't have a prompt, and it's Android, we can't do much but show a hint
      if (!isIOS && isMobile) {
        alert('Чтобы установить приложение, нажмите на три точки в меню браузера и выберите "Установить приложение" или "Добавить на гл. экран".');
      }
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
      return true;
    } else {
      return false;
    }
  };

  return (
    <PWAContext.Provider value={{ 
      deferredPrompt, 
      isInstallable, 
      isStandalone, 
      install, 
      showIOSInstructions, 
      setShowIOSInstructions,
      isIOS,
      isMobile
    }}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) throw new Error('usePWA must be used within a PWAProvider');
  return context;
};
