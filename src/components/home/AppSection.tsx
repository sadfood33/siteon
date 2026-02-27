import { motion } from 'framer-motion';
import { Smartphone, Download, Zap, ShieldCheck, ShoppingBag, Share, PlusSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { usePWA } from '../../context/PWAContext';
import { useToast } from '../../context/ToastContext';

export const AppSection = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sadfood.online';
  const { isInstallable, install, isIOS, isStandalone, isMobile } = usePWA();
  const { showToast } = useToast();

  const handleInstallClick = async () => {
    if (isStandalone) {
      showToast('Приложение уже установлено', 'info');
      return;
    }

    if (isInstallable || isIOS) {
      const success = await install();
      if (success) {
        showToast('Приложение устанавливается...', 'success');
      }
    } else {
      // If prompt not yet available, show a helpful message instead of "Wait"
      if (!isIOS && isMobile) {
        showToast('Используйте меню браузера (три точки) -> "Установить приложение"', 'info', 5000);
      } else if (!isMobile) {
        showToast('Установка доступна только на мобильных устройствах. Отсканируйте QR-код!', 'info', 5000);
      } else {
        showToast('Браузер подготавливает приложение. Попробуйте через пару секунд.', 'info');
      }
    }
  };

  return (
    <section id="app" className="py-16 md:py-24 bg-[#121212] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[30px] md:rounded-[40px] border border-gray-800 p-6 md:p-16 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff00]/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8a2be2]/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff00]/10 rounded-full border border-[#00ff00]/20">
                <Smartphone className="text-[#00ff00]" size={18} />
                <span className="text-[#00ff00] text-xs md:text-sm font-bold uppercase tracking-wider">Мобильное приложение</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Заказывайте быстрее с <br />
                <span className="text-[#00ff00]">S.A.D. Food App</span>
              </h2>

              <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
                Полноценный опыт мобильного приложения. Мгновенный запуск, оффлайн режим и эксклюзивные скидки прямо на вашем телефоне.
              </p>

              {isIOS && isMobile ? (
                <div className="bg-black/40 p-6 rounded-3xl border border-gray-800 space-y-4">
                   <h4 className="font-bold text-white flex items-center gap-2">
                     <Download size={20} className="text-[#00ff00]" />
                     Установка на iPhone
                   </h4>
                   <div className="space-y-3">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                         <Share size={20} />
                       </div>
                       <p className="text-sm text-gray-300">Нажмите кнопку <span className="text-white font-bold">«Поделиться»</span> в меню браузера</p>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#00ff00]/20 rounded-xl flex items-center justify-center text-[#00ff00] shrink-0">
                         <PlusSquare size={20} />
                       </div>
                       <p className="text-sm text-gray-300">Выберите пункт <span className="text-white font-bold">«На экран Домой»</span></p>
                     </div>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-800/20 rounded-2xl border border-gray-800/50">
                    <div className="w-10 h-10 bg-[#00ff00]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Zap className="text-[#00ff00]" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-0.5">Мгновенно</h4>
                      <p className="text-xs text-gray-500">Запуск без ожидания загрузки браузера</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-800/20 rounded-2xl border border-gray-800/50">
                    <div className="w-10 h-10 bg-[#00ff00]/10 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-[#00ff00]" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-0.5">Надежно</h4>
                      <p className="text-xs text-gray-500">Работает даже при плохом сигнале</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-6 pt-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Show install button only on mobile and only if not installed */}
                  {isMobile && !isStandalone && (
                    <button
                      onClick={handleInstallClick}
                      className={`w-full sm:w-auto px-8 py-5 text-black font-black rounded-2xl transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-3 text-lg select-none touch-manipulation ${
                        isInstallable || isIOS 
                        ? 'bg-[#00ff00] hover:bg-[#00dd00] shadow-[#00ff00]/20' 
                        : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <Download size={24} />
                      {isInstallable || isIOS ? 'Установить приложение' : 'Запуск приложения...'}
                    </button>
                  )}

                  {/* On Desktop or if already installed, show status/instructions */}
                  {(isStandalone || !isMobile) && (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {isStandalone ? (
                        <div className="px-8 py-5 bg-[#00ff00]/10 text-[#00ff00] font-black rounded-2xl border border-[#00ff00]/30 flex items-center gap-3">
                          <ShieldCheck size={24} />
                          Приложение установлено
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-xl shadow-[#00ff00]/10 border-2 border-white">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-1">
                            <QRCodeSVG 
                                value={currentUrl} 
                                size={60}
                                level="H"
                              />
                          </div>
                          <div className="text-black pr-2">
                            <p className="text-[10px] font-black leading-tight uppercase tracking-tight text-gray-400">Scan QR Code</p>
                            <p className="text-sm font-black leading-tight uppercase tracking-tighter">Наведи<br />камеру</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {!isStandalone && (
                  <p className="text-center sm:text-left text-xs text-gray-500">
                    {isMobile 
                      ? '* Поддерживается на iPhone (Safari) и любом Android смартфоне' 
                      : '* Отсканируйте код, чтобы установить приложение на свой смартфон'}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden shadow-[#00ff00]/20">
                <div className="absolute inset-0 bg-[#0a0a0a] p-6">
                  <div className="flex justify-between items-center mb-6 pt-4 text-white">
                    <div className="text-xl font-bold text-[#00ff00]">S.A.D. FOOD</div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-[#1a1a1a] to-black rounded-2xl p-4 border border-gray-800">
                      <div className="w-1/2 h-4 bg-[#00ff00]/20 rounded mb-2" />
                      <div className="w-3/4 h-3 bg-gray-800 rounded" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="h-40 bg-gradient-to-t from-black to-[#1a1a1a] rounded-2xl border border-gray-800" />
                       <div className="h-40 bg-gradient-to-t from-black to-[#1a1a1a] rounded-2xl border border-gray-800" />
                    </div>

                    <div className="h-20 bg-[#00ff00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00ff00]/20">
                       <ShoppingBag className="text-black" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl" />
              </div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 bg-gradient-to-br from-[#00ff00] to-[#008800] p-6 rounded-3xl shadow-2xl border border-white/10 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl text-black">
                    <Download size={24} />
                  </div>
                  <div>
                    <p className="text-black font-bold text-sm">MOBILE APP</p>
                    <p className="text-black/70 text-xs text-center font-bold">УСТАНОВИТЬ</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
