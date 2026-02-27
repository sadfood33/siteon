import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const promotions = [
  {
    id: 1,
    title: "10 хинкали = 690₽",
    subtitle: "Скидка 20% при заказе от 10 хинкали. Экономия 180₽.",
    bgColor: "bg-[#8a2be2]",
    image: "https://images.unsplash.com/photo-1594834749740-74b3f6764be4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Бургер + Кола = 450₽",
    subtitle: "Сытный обед по выгодной цене.",
    bgColor: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Пицца в подарок",
    subtitle: "При заказе двух больших пицц — третья бесплатно!",
    bgColor: "bg-green-600",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

export const PromotionsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-[#121212]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          Акции и <span className="text-[#00ff00]">скидки</span>
        </h2>

        <div className="relative h-[650px] sm:h-[600px] md:h-[450px] lg:h-[400px] rounded-3xl overflow-hidden mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 flex flex-col md:flex-row items-stretch ${promotions[currentIndex].bgColor}`}
            >
              <div className="p-8 md:p-12 text-white z-10 flex flex-col justify-center shrink-0 md:flex-1">
                <h3 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                  {promotions[currentIndex].title}
                </h3>
                <p className="text-sm lg:text-lg opacity-90 mb-6 md:mb-8 max-w-md">
                  {promotions[currentIndex].subtitle}
                </p>
                <div className="flex gap-3 md:gap-4 mb-4 md:mb-0">
                  <Link to="/catalog?promo=true" className="px-5 py-3 md:px-6 md:py-3 bg-white text-black font-black rounded-xl hover:bg-[#00ff00] hover:scale-105 transition-all shadow-lg active:scale-95">
                    Заказать сет
                  </Link>
                  <Link to="/catalog?promo=true" className="px-5 py-3 md:px-6 md:py-3 border-2 border-white text-white font-black rounded-xl hover:bg-white/10 transition-all active:scale-95">
                    -20% скидка
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-full overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-black/20 z-10" />
                 <img
                   src={promotions[currentIndex].image}
                   alt={promotions[currentIndex].title}
                   className="w-full h-full object-cover"
                 />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
