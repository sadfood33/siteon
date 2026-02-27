import { businessLunches } from '../../data/products';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../data/products';

export const BusinessLunchSection = () => {
  const { addToCart } = useCart();

  return (
    <section id="business-lunch" className="py-20 bg-[#121212]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          Бизнес-ланч от <span className="text-[#00ff00]">299 ₽</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Полноценный обед по специальной цене. Доступно каждый будний день с 12:00 до 16:00.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {businessLunches.map((lunch) => (
            <div key={lunch.id} className="bg-[#1a1a1a] rounded-3xl p-6 lg:p-8 border border-gray-800 hover:border-[#00ff00]/50 transition-colors flex flex-col">
              <div className="flex-1">
                <div className={`${lunch.color} inline-block px-4 py-1 rounded-full text-black font-bold text-sm mb-6`}>
                  {lunch.name}
                </div>
                <ul className="space-y-4 mb-8">
                  {lunch.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300 text-sm lg:text-base">
                      <span className="w-2 h-2 rounded-full bg-gray-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pt-6 border-t border-gray-800 mt-auto">
                <div className="shrink-0">
                  <span className="text-3xl font-bold text-white">{lunch.price} ₽</span>
                </div>
                <button
                  onClick={() => addToCart({
                    id: 1000 + lunch.id,
                    name: lunch.name,
                    price: lunch.price,
                    description: lunch.items.join(', '),
                    image: 'https://images.unsplash.com/photo-1543353071-087f9a7ce56d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
                    category: 'Ланч',
                    tags: ['Ланч'],
                    calories: 650,
                    weight: '550 гр',
                    proteins: 25,
                    fats: 30,
                    carbs: 70
                  } as Product)}
                  className="w-full xl:w-auto px-8 py-3.5 bg-white text-black font-black rounded-xl hover:bg-[#00ff00] hover:text-black hover:shadow-2xl hover:shadow-[#00ff00]/40 hover:-translate-y-1 active:scale-95 transition-all shadow-lg whitespace-nowrap text-center ring-0 hover:ring-4 ring-[#00ff00]/20"
                >
                  Заказать
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-700">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#00ff00]/10 rounded-2xl">
              <Briefcase className="text-[#00ff00]" size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Корпоративные заказы</h3>
              <p className="text-gray-400 max-w-lg">
                Скидки от 15% при заказе от 10 порций. Индивидуальное меню и бесплатная доставка в офис.
              </p>
            </div>
          </div>
          <Link to="/#contacts" className="whitespace-nowrap px-8 py-4 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors flex items-center gap-2">
            Узнать подробнее
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};
