import { MapPin, Clock, Phone, Instagram, Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="contacts" className="bg-[#050505] pt-20 pb-8 border-t border-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl font-bold">
              Ждём вас <span className="text-[#00ff00]">в гостях</span>
            </h2>
            
            <div className="space-y-6 text-gray-400">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#00ff00] mt-1" />
                <p>г. Кольчугино, ул. 3-го Интернационала, д. 85</p>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-[#00ff00] mt-1" />
                <p>Ежедневно: 10:00 — 23:00</p>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-[#00ff00] mt-1" />
                <p>8-920-620-26-26</p>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="https://t.me/sadfood_bot" className="p-3 bg-[#1a1a1a] rounded-full hover:bg-[#00ff00] hover:text-black transition-colors">
                <Send size={20} />
              </a>
              <a href="#" className="p-3 bg-[#1a1a1a] rounded-full hover:bg-[#00ff00] hover:text-black transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 h-[400px] rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800 shadow-2xl">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=39.381235,56.302952&z=17&pt=39.381235,56.302952,pm2rdm"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2023 S.A.D. food. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
