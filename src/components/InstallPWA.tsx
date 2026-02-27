import { X, Smartphone, Share, PlusSquare, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../context/PWAContext';

export const InstallPWA = () => {
  const { isStandalone, install, isIOS, showIOSInstructions, setShowIOSInstructions, isMobile, isInstallable } = usePWA();

  const handleClose = () => {
    setShowIOSInstructions(false);
  };

  const handleInstall = async () => {
    await install();
  };

  // Requirement: Remove floating banner for installation on mobile site
  // Only show the manual instruction if triggered from AppSection (showIOSInstructions)
  if (isStandalone || !isMobile || !showIOSInstructions) return null;

  return (
    <AnimatePresence>
      {showIOSInstructions && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-[100] md:bottom-8 md:left-auto md:right-8 md:w-96"
        >
          <div className="bg-[#1a1a1a] border border-[#00ff00]/30 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff00]/5 blur-3xl rounded-full" />
            
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#00ff00] to-[#008800] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00ff00]/20 shrink-0">
                <Smartphone className="text-black" size={28} />
              </div>
              <div className="flex-1 pr-6">
                <h4 className="font-bold text-white text-lg mb-1">Установка S.A.D. FOOD</h4>
                
                {isIOS ? (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm leading-snug">
                      Установите для быстрого доступа:
                    </p>
                    <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-3 text-xs text-white">
                        <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                          <Share size={14} />
                        </div>
                        <span>1. Нажмите «Поделиться»</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white">
                        <div className="p-1.5 bg-[#00ff00]/20 rounded-lg text-[#00ff00]">
                          <PlusSquare size={14} />
                        </div>
                        <span>2. «На экран Домой»</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm mb-4 leading-snug">
                      Нажмите кнопку ниже для быстрой установки приложения на рабочий стол.
                    </p>
                    <button
                      onClick={handleInstall}
                      className={`w-full font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 mt-2 ${
                        isInstallable 
                          ? 'bg-[#00ff00] text-black hover:bg-[#00dd00] shadow-[#00ff00]/10' 
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <Download size={18} />
                      {isInstallable ? 'Установить сейчас' : 'Добавить на гл. экран'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
