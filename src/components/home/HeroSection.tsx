import { Link } from 'react-router-dom';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-10 lg:pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 lg:space-y-8 z-10 text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            Еда, которая делает тебя <span className="text-[#00ff00]">счастливым</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Свежие ингредиенты, авторские рецепты и быстрая доставка.
            S.A.D. food — это про вкус и качество.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/catalog"
              className="px-8 py-4 bg-[#00ff00] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
            >
              Смотреть каталог
              <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-4 border-2 border-[#00ff00] text-[#00ff00] font-bold rounded-full hover:bg-[#00ff00]/10 transition-colors">
              Заказать
            </button>
          </div>

          <div className="flex gap-8 pt-8 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <Clock className="text-[#00ff00]" size={24} />
              <div>
                <p className="font-bold text-xl">5+ лет</p>
                <p className="text-sm text-gray-500">на рынке</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-[#00ff00]" size={24} />
              <div>
                <p className="font-bold text-xl">50k+</p>
                <p className="text-sm text-gray-500">клиентов</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="text-[#00ff00]" size={24} />
              <div>
                <p className="font-bold text-xl">4.9</p>
                <p className="text-sm text-gray-500">рейтинг</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Delicious Burger"
              className="w-full max-w-[600px] mx-auto rounded-3xl shadow-2xl shadow-[#00ff00]/20 object-cover aspect-square"
            />
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-6 -right-6 bg-[#1a1a1a] p-4 rounded-xl border border-gray-700 shadow-xl"
            >
              <span className="text-[#00ff00] font-bold text-lg">2-1 на бургеры!</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -bottom-6 -left-6 bg-[#1a1a1a] p-4 rounded-xl border border-gray-700 shadow-xl flex items-center gap-3"
            >
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Star className="text-orange-500" size={24} fill="currentColor" />
              </div>
              <div>
                <p className="font-bold">Топ продаж</p>
                <p className="text-sm text-gray-400">Бургеры</p>
              </div>
            </motion.div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#00ff00]/5 blur-[100px] -z-10 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};
