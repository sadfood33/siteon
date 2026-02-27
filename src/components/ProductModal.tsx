import { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { X, Plus, Minus, Heart, Flame, Droplets, Wheat, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheet } from './ui/BottomSheet';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
    onClose();
  };

  const totalPrice = product.price * quantity;

  const ModalContent = () => (
    <div className="flex flex-col md:flex-row">
      {/* Image */}
      <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden rounded-2xl md:rounded-none">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
              product.badge === 'Хит' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' :
              product.badge === 'Акция' ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' :
              product.badge === 'Новинка' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' :
              'bg-gradient-to-r from-red-600 to-orange-500 text-white'
            }`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
            isFavorite(product.id)
              ? 'bg-[#00ff00]/20 text-[#00ff00]'
              : 'bg-black/50 text-white/70 hover:text-white'
          }`}
        >
          <Heart size={20} className={isFavorite(product.id) ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="p-0 md:p-8 md:w-1/2 flex flex-col mt-6 md:mt-0">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-sm text-[#00ff00] font-medium px-3 py-1 bg-[#00ff00]/10 rounded-full inline-block mb-2">
                {product.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{product.name}</h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 mb-6 leading-relaxed text-sm md:text-base">
            {product.description}
          </p>

          {/* Nutrition Info */}
          {(product.weight || product.calories) && (
            <div className="bg-[#0a0a0a] rounded-2xl p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Пищевая ценность</p>
              <div className="grid grid-cols-4 gap-3">
                {product.weight && (
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-2 text-gray-400">
                      <ShoppingBag size={18} />
                    </div>
                    <p className="text-white font-semibold text-xs md:text-sm">{product.weight}</p>
                    <p className="text-gray-500 text-[10px] md:text-xs">Размер</p>
                  </div>
                )}
                {product.calories && (
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-2 text-orange-400">
                      <Flame size={18} />
                    </div>
                    <p className="text-white font-semibold text-xs md:text-sm">{product.calories}</p>
                    <p className="text-gray-500 text-[10px] md:text-xs">Ккал</p>
                  </div>
                )}
                {product.proteins && (
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-2 text-blue-400">
                      <Droplets size={18} />
                    </div>
                    <p className="text-white font-semibold text-xs md:text-sm">{product.proteins}г</p>
                    <p className="text-gray-500 text-[10px] md:text-xs">Белки</p>
                  </div>
                )}
                {product.fats && (
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-2 text-yellow-400">
                      <Wheat size={18} />
                    </div>
                    <p className="text-white font-semibold text-xs md:text-sm">{product.fats}г</p>
                    <p className="text-gray-500 text-[10px] md:text-xs">Жиры</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-800">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-400 font-medium">Количество</span>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center bg-[#252525] text-white rounded-xl hover:bg-[#333] active:scale-90 transition-all disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl font-bold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center bg-[#252525] text-white rounded-xl hover:bg-[#333] active:scale-90 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Итого</p>
              <p className="text-2xl font-bold text-[#00ff00]">{totalPrice} ₽</p>
            </div>
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              className="flex-[2] bg-[#00ff00] text-black font-extrabold py-4 px-6 rounded-2xl hover:bg-[#00dd00] transition-colors flex items-center justify-center gap-3 shadow-lg shadow-[#00ff00]/20"
            >
              <ShoppingBag size={22} />
              В корзину
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={!!product} onClose={onClose}>
        <ModalContent />
      </BottomSheet>
    );
  }

  return (
    <AnimatePresence>
      {product && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" 
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#1a1a1a] to-[#121212] rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
          >
            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
            <ModalContent />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
