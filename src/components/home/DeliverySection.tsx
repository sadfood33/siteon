import { Smartphone, ChefHat, Truck, Phone, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDelivery } from '../../context/DeliveryContext';

const steps = [
  {
    icon: Smartphone,
    title: "Оформите заказ",
    description: "Выберите блюда в приложении или на сайте"
  },
  {
    icon: ChefHat,
    title: "Готовим свежее",
    description: "Начинаем готовить сразу после подтверждения"
  },
  {
    icon: Truck,
    title: "Быстрая доставка",
    description: "Курьер привезет заказ в течение 30 минут"
  }
];

export const DeliverySection = () => {
  const { settings } = useDelivery();

  return (
    <section id="delivery" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Привезём за <span className="text-[#00ff00]">{settings.estimatedTime}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="text-center relative z-10"
            >
              <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#00ff00]/20 shadow-[0_0_20px_rgba(0,255,0,0.1)] group hover:border-[#00ff00] transition-colors">
                <step.icon className="text-[#00ff00]" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
          
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-800 -z-0" />
        </div>

        <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Бесплатная доставка</h3>
            <p className="text-gray-400">
              При заказе от {settings.freeDeliveryThreshold} ₽ доставим бесплатно в любую точку города.
              {settings.deliveryFee > 0 && (
                <span className="block mt-1 text-sm">
                  Для заказов менее {settings.freeDeliveryThreshold} ₽ стоимость доставки — {settings.deliveryFee} ₽
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <a href="tel:+79991234567" className="px-6 py-3 border border-gray-600 rounded-xl hover:border-[#00ff00] hover:text-[#00ff00] transition-colors flex items-center gap-2">
              <Phone size={20} />
              Позвонить
            </a>
            <a href="https://t.me/sadfood_bot" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#0088cc] text-white rounded-xl hover:bg-[#0077b5] transition-colors flex items-center gap-2">
              <Send size={20} />
              Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
