import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDelivery } from '../context/DeliveryContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { emailService } from '../services/emailService';
import { X, CreditCard, Banknote, MapPin, Phone, User, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheet } from './ui/BottomSheet';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, subtotal, items, clearCart, setIsOpen } = useCart();
  const { user } = useAuth();
  const { calculateDeliveryFee, isFreeDelivery } = useDelivery();
  const { showToast } = useToast();
  
  const deliveryFee = calculateDeliveryFee(subtotal);
  const totalWithDelivery = subtotal + deliveryFee;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'card' as 'card' | 'cash'
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>('manual');
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper to format address object to string
  const formatAddress = (addr: any) => {
    return `${addr.city}, ${addr.street}, д. ${addr.house}${addr.apartment ? `, кв. ${addr.apartment}` : ''}${addr.entrance ? `, под. ${addr.entrance}` : ''}${addr.floor ? `, этаж ${addr.floor}` : ''}${addr.intercom ? `, домофон ${addr.intercom}` : ''}`;
  };

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone
      }));

      // If user has addresses, pre-select the first one
      if (user.addresses && user.addresses.length > 0) {
        const firstAddr = user.addresses[0];
        setSelectedAddressId(firstAddr.id);
        setFormData(prev => ({ ...prev, address: formatAddress(firstAddr) }));
      }
    }
  }, [user]);

  const handleAddressSelect = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === 'manual') {
      setFormData(prev => ({ ...prev, address: '' }));
    } else {
      const savedAddr = user?.addresses.find(a => a.id === addrId);
      if (savedAddr) {
        setFormData(prev => ({ ...prev, address: formatAddress(savedAddr) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name || !formData.phone || !formData.address) {
      showToast('Пожалуйста, заполните все поля', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Use user ID if logged in, otherwise use 'guest'
      const userId = user ? user.id : 'guest';
      const userEmail = user ? user.email : 'guest@sadfood.online';

      const order = await api.orders.create(
        userId,
        items,
        totalWithDelivery,
        formData.address,
        formData.payment
      );
      
      // Отправка уведомления на почту (в симуляции)
      await emailService.sendOrderConfirmation(order, userEmail);
      
      showToast('Заказ успешно оформлен! Мы скоро свяжемся с вами.', 'success');
      clearCart();
      setIsCheckoutOpen(false);
      setIsOpen(false);
    } catch {
      showToast('Ошибка оформления заказа', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          {isMobile ? (
            <BottomSheet 
              isOpen={isCheckoutOpen} 
              onClose={() => setIsCheckoutOpen(false)}
              title="Оформление заказа"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <form id="checkout-form-mobile" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Контактные данные</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Ваше имя"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                          required
                          autoComplete="name"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          placeholder="Телефон"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                          required
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-400">Адрес доставки</label>
                        {user && user.addresses.length > 0 && (
                          <span className="text-xs text-[#00ff00]">Выберите из списка</span>
                        )}
                      </div>

                      {user && user.addresses.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          <button
                            type="button"
                            onClick={() => handleAddressSelect('manual')}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                              selectedAddressId === 'manual'
                                ? 'bg-[#00ff00] border-[#00ff00] text-black'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                            }`}
                          >
                            <MapPin size={16} />
                            Вручную
                          </button>
                          {user.addresses.map((addr) => (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => handleAddressSelect(addr.id)}
                              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                                selectedAddressId === addr.id
                                  ? 'bg-[#00ff00] border-[#00ff00] text-black'
                                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                              }`}
                            >
                              <MapPin size={16} />
                              {addr.title}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                        <textarea
                          placeholder="Адрес доставки (улица, дом, квартира)"
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({ ...formData, address: e.target.value });
                            if (selectedAddressId !== 'manual') {
                              const matchingAddr = user?.addresses.find(a => formatAddress(a) === e.target.value);
                              if (!matchingAddr) setSelectedAddressId('manual');
                            }
                          }}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 pl-10 pr-4 h-24 resize-none focus:outline-none focus:border-[#00ff00] transition-colors"
                          required
                          autoComplete="street-address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Способ оплаты</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, payment: 'card' })}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                            formData.payment === 'card'
                              ? 'bg-[#00ff00]/10 border-[#00ff00] text-[#00ff00]'
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <CreditCard size={24} />
                          <span className="font-bold">Картой</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, payment: 'cash' })}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                            formData.payment === 'cash'
                              ? 'bg-[#00ff00]/10 border-[#00ff00] text-[#00ff00]'
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <Banknote size={24} />
                          <span className="font-bold">Наличными</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-800 space-y-4">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Товары ({items.length}):</span>
                    <span className="text-white">{subtotal} ₽</span>
                  </div>

                  <div className="flex justify-between text-gray-400 text-sm">
                    <span className="flex items-center gap-2">
                      <Truck size={16} />
                      Доставка:
                    </span>
                    {isFreeDelivery(subtotal) ? (
                      <span className="text-[#00ff00] font-medium">Бесплатно</span>
                    ) : (
                      <span className="text-white">{deliveryFee} ₽</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-white leading-none">Итого:</span>
                    <span className="text-2xl font-bold text-[#00ff00] leading-none">{totalWithDelivery} ₽</span>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form-mobile"
                    disabled={isSubmitting}
                    className="w-full bg-[#00ff00] disabled:bg-gray-700 disabled:text-gray-400 text-black font-black py-4 rounded-2xl hover:bg-[#00cc00] active:scale-[0.98] transition-all shadow-lg shadow-[#00ff00]/10 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Оформление...
                      </>
                    ) : 'Оформить заказ'}
                  </button>
                </div>
              </div>
            </BottomSheet>
          ) : (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <h2 className="text-2xl font-bold text-white">Оформление заказа</h2>
                  <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-400">Контактные данные</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              placeholder="Ваше имя"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                              required
                            />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="tel"
                              placeholder="Телефон"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-400">Адрес доставки</label>
                            {user && user.addresses.length > 0 && (
                              <span className="text-xs text-[#00ff00]">Выберите из списка</span>
                            )}
                          </div>

                          {user && user.addresses.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                              <button
                                type="button"
                                onClick={() => handleAddressSelect('manual')}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                                  selectedAddressId === 'manual'
                                    ? 'bg-[#00ff00] border-[#00ff00] text-black'
                                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                                }`}
                              >
                                <MapPin size={16} />
                                Вручную
                              </button>
                              {user.addresses.map((addr) => (
                                <button
                                  key={addr.id}
                                  type="button"
                                  onClick={() => handleAddressSelect(addr.id)}
                                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                                    selectedAddressId === addr.id
                                      ? 'bg-[#00ff00] border-[#00ff00] text-black'
                                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                                  }`}
                                >
                                  <MapPin size={16} />
                                  {addr.title}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                            <textarea
                              placeholder="Адрес доставки (улица, дом, квартира)"
                              value={formData.address}
                              onChange={(e) => {
                                setFormData({ ...formData, address: e.target.value });
                                if (selectedAddressId !== 'manual') {
                                  const matchingAddr = user?.addresses.find(a => formatAddress(a) === e.target.value);
                                  if (!matchingAddr) setSelectedAddressId('manual');
                                }
                              }}
                              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 pl-10 pr-4 h-24 resize-none focus:outline-none focus:border-[#00ff00] transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-400">Способ оплаты</label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, payment: 'card' })}
                              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                                formData.payment === 'card'
                                  ? 'bg-[#00ff00]/10 border-[#00ff00] text-[#00ff00]'
                                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                              }`}
                            >
                              <CreditCard size={24} />
                              <span className="font-bold">Картой</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, payment: 'cash' })}
                              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                                formData.payment === 'cash'
                                  ? 'bg-[#00ff00]/10 border-[#00ff00] text-[#00ff00]'
                                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                              }`}
                            >
                              <Banknote size={24} />
                              <span className="font-bold">Наличными</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-800 bg-[#1a1a1a] space-y-4">
                      <div className="flex justify-between text-gray-400 text-sm">
                        <span>Товары ({items.length}):</span>
                        <span className="text-white">{subtotal} ₽</span>
                      </div>

                      <div className="flex justify-between text-gray-400 text-sm">
                        <span className="flex items-center gap-2">
                          <Truck size={16} />
                          Доставка:
                        </span>
                        {isFreeDelivery(subtotal) ? (
                          <span className="text-[#00ff00] font-medium">Бесплатно</span>
                        ) : (
                          <span className="text-white">{deliveryFee} ₽</span>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-white leading-none">Итого:</span>
                        <span className="text-2xl font-bold text-[#00ff00] leading-none">{totalWithDelivery} ₽</span>
                      </div>

                      <button
                        type="submit"
                        form="checkout-form"
                        disabled={isSubmitting}
                        className="w-full bg-[#00ff00] disabled:bg-gray-700 disabled:text-gray-400 text-black font-black py-4 rounded-2xl hover:bg-[#00cc00] active:scale-[0.98] transition-all shadow-lg shadow-[#00ff00]/10 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Оформление...
                          </>
                        ) : 'Оформить заказ'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
