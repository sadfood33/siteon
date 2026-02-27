import { useCart } from '../context/CartContext';
import { useDelivery } from '../context/DeliveryContext';
import { X, Plus, Minus, ShoppingBag, Truck, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const { isOpen, setIsOpen, items, updateQuantity, removeFromCart, subtotal, setIsCheckoutOpen } = useCart();
  const { calculateDeliveryFee, isFreeDelivery, getAmountForFreeDelivery, settings } = useDelivery();

  const deliveryFee = calculateDeliveryFee(subtotal);
  const totalWithDelivery = subtotal + deliveryFee;
  const amountForFreeDelivery = getAmountForFreeDelivery(subtotal);
  const freeDeliveryProgress = Math.min((subtotal / settings.freeDeliveryThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-[#1a1a1a] h-full shadow-2xl flex flex-col border-l border-gray-800 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="text-[#00ff00]" />
                Корзина
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Free Delivery Progress */}
            {items.length > 0 && !isFreeDelivery(subtotal) && (
              <div className="px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-[#00ff00]/5 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={16} className="text-[#00ff00]" />
                  <span className="text-sm text-gray-300">
                    До бесплатной доставки: <span className="text-[#00ff00] font-bold">{amountForFreeDelivery} ₽</span>
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#00ff00] to-[#00cc00]"
                    initial={{ width: 0 }}
                    animate={{ width: `${freeDeliveryProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Бесплатная доставка от {settings.freeDeliveryThreshold} ₽
                </p>
              </div>
            )}

            {/* Free Delivery Achieved */}
            {items.length > 0 && isFreeDelivery(subtotal) && (
              <div className="px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-[#00ff00]/10 to-transparent">
                <div className="flex items-center gap-2">
                  <Gift size={18} className="text-[#00ff00]" />
                  <span className="text-sm text-[#00ff00] font-medium">
                    🎉 Поздравляем! Доставка бесплатная!
                  </span>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="text-center text-gray-400 mt-20 flex flex-col items-center gap-4">
                  <ShoppingBag size={64} className="text-gray-700" />
                  <p className="text-xl font-medium">Корзина пуста</p>
                  <p className="text-sm text-gray-500">Добавьте что-нибудь вкусное!</p>
                  <Link 
                    to="/catalog" 
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-6 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors"
                  >
                    Перейти в каталог
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 bg-gray-800/50 p-4 rounded-xl"
                  >
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-[#00ff00] font-bold mt-1">{item.price} ₽</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white w-6 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        <span className="ml-auto text-gray-400 text-sm">
                          {item.price * item.quantity} ₽
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer with Totals */}
            {items.length > 0 && (
              <div className="border-t border-gray-800 p-6 space-y-4 bg-[#0d0d0d]">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-400">
                  <span>Сумма заказа:</span>
                  <span className="text-white">{subtotal} ₽</span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <Truck size={16} />
                    Доставка:
                  </span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#00ff00] font-medium">Бесплатно</span>
                  ) : (
                    <span className="text-white">{deliveryFee} ₽</span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Итого:</span>
                    <span className="text-[#00ff00]">{totalWithDelivery} ₽</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    setIsCheckoutOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full bg-[#00ff00] text-black font-bold py-4 rounded-xl hover:bg-[#00cc00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={items.length === 0}
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
