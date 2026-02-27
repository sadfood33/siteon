import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductModal } from '../ProductModal';
import { Product } from '../../data/products';

export const BestSellersSection = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const bestSellers = products.slice(0, 4);

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
          Хиты <span className="text-[#00ff00]">продаж</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-12">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="group relative bg-[#1a1a1a] rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-[#00ff00]/10 transition-all duration-300 border border-gray-800"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-[#00ff00] text-black p-2 sm:p-3 rounded-full sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-4 sm:group-hover:translate-y-0 transition-all duration-300 shadow-lg z-10"
                  aria-label="Add to cart"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-1 sm:mb-2 gap-1">
                  <h3 className="text-sm sm:text-xl font-bold line-clamp-1">{product.name}</h3>
                  <span className="font-bold text-[#00ff00] text-xs sm:text-base whitespace-nowrap">{product.price} ₽</span>
                </div>
                <p className="hidden sm:block text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full py-2 sm:py-3 border border-gray-700 sm:border-gray-600 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold hover:bg-white hover:text-black hover:border-white transition-colors mt-2"
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/catalog"
            className="inline-block px-10 py-4 bg-[#00ff00] text-black font-bold rounded-full hover:bg-[#00cc00] transition-colors"
          >
            Смотреть весь каталог
          </Link>
        </div>

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
};
