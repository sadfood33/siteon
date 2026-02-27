// src/components/catalog/ProductGrid.tsx
import { useState, useEffect, useCallback } from 'react';
import { Product } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Heart, Search, Eye, Check, ShoppingCart, Star, Flame, Sparkles, AlertTriangle } from 'lucide-react';
import { ProductModal } from '../ProductModal';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
}

// Цвета для бейджей
const badgeConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  'Хит': { 
    bg: 'bg-gradient-to-r from-orange-500 to-red-500', 
    text: 'text-white',
    icon: <Star size={12} className="fill-current" />
  },
  'Акция': { 
    bg: 'bg-gradient-to-r from-purple-500 to-pink-500', 
    text: 'text-white',
    icon: <Flame size={12} className="fill-current" />
  },
  'Новинка': { 
    bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', 
    text: 'text-white',
    icon: <Sparkles size={12} className="fill-current" />
  },
  'Острое': { 
    bg: 'bg-gradient-to-r from-red-600 to-orange-500', 
    text: 'text-white',
    icon: <AlertTriangle size={12} className="fill-current" />
  },
};

const defaultBadge = { 
  bg: 'bg-gradient-to-r from-[#00ff00] to-green-600', 
  text: 'text-white',
  icon: <Star size={12} className="fill-current" />
};

export const ProductGrid = ({ products, isLoading = false, onProductClick }: ProductGridProps) => {
  const { addToCart, items: cartItems } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<Record<number, boolean>>({});

  // Отладочная информация в консоль
  useEffect(() => {
    console.log('📦 ProductGrid: Received products count:', products.length);
    if (products.length > 0) {
      console.log('📦 First product:', products[0]);
      console.log('📦 localStorage products:', localStorage.getItem('products')?.substring(0, 100) + '...');
    }
  }, [products]);

  // Обработчик добавления в корзину
  const handleAddToCart = useCallback((product: Product, event?: React.MouseEvent) => {
    event?.stopPropagation();
    
    setIsAnimating(prev => ({ ...prev, [product.id]: true }));
    
    try {
      addToCart(product);
      setAddedToCart(product.id);
      
      // Быстрое уведомление
      showToast(`${product.name} добавлен в корзину`, 'success', 800);
      
      // Сброс состояния кнопки
      setTimeout(() => {
        setAddedToCart(null);
        setIsAnimating(prev => ({ ...prev, [product.id]: false }));
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Ошибка добавления в корзину', 'error');
    }
  }, [addToCart, showToast]);

  // Обработчик избранного
  const handleToggleFavorite = useCallback((product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      toggleFavorite(product.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [toggleFavorite]);

  // Обработчик клика по продукту
  const handleProductClick = useCallback((product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      setSelectedProduct(product);
    }
  }, [onProductClick]);

  // Проверка количества в корзине
  const getCartQuantity = useCallback((productId: number): number => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }, [cartItems]);

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800"
          >
            <div className="aspect-square bg-gray-800 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
              <div className="h-10 bg-gray-800 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Пустое состояние
  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 px-4"
      >
        <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 border border-gray-800">
          <Search size={40} className="text-gray-600" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Ничего не найдено</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Попробуйте изменить параметры поиска или сбросить фильтры
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#1a1a1a] border border-gray-700 text-white rounded-xl hover:border-[#00ff00] hover:text-[#00ff00] transition-colors"
        >
          Сбросить фильтры
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => {
            const badge = product.badge ? badgeConfig[product.badge] : null;
            const isInCart = getCartQuantity(product.id) > 0;
            const cartQuantity = getCartQuantity(product.id);
            const isAnimatingButton = isAnimating[product.id];

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] rounded-2xl overflow-hidden border border-gray-800/50 hover:border-[#00ff00]/30 transition-all group relative cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {/* Изображение */}
                <div className="relative aspect-square overflow-hidden bg-gray-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzNhM2EzYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iYXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                  
                  {/* Градиент overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Кнопка избранного */}
                  <button
                    onClick={(e) => handleToggleFavorite(product, e)}
                    className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all z-10 ${
                      isFavorite(product.id)
                        ? 'bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30'
                        : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70 border border-transparent'
                    }`}
                    aria-label={isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                  >
                    <Heart 
                      size={18} 
                      className={isFavorite(product.id) ? 'fill-current' : ''} 
                    />
                  </button>

                  {/* Бейдж */}
                  {product.badge && badge && (
                    <motion.div 
                      className="absolute bottom-3 left-3 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <span className={`${badge.bg} ${badge.text} text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1`}>
                        {badge.icon}
                        {product.badge}
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Кнопка быстрого просмотра */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                    className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-10"
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">Подробнее</span>
                  </motion.button>

                  {/* Индикатор наличия в корзине */}
                  {isInCart && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex items-center gap-1 px-2 py-1 bg-[#00ff00]/90 text-black text-xs font-bold rounded-lg">
                        <ShoppingCart size={12} />
                        <span>{cartQuantity} шт</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Контент */}
                <div className="p-3 sm:p-4">
                  {/* Категория и название */}
                  <div className="mb-2 sm:mb-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                      {product.category}
                    </p>
                    <h3 
                      className="text-sm sm:text-lg font-bold text-white leading-tight hover:text-[#00ff00] transition-colors line-clamp-1"
                    >
                      {product.name}
                    </h3>
                  </div>
                
                  {/* Описание (только для больших экранов) */}
                  <p className="hidden sm:block text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {product.description}
                  </p>
                
                  {/* Цена и кнопка */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-800/50">
                    <div className="flex flex-col">
                      <span className="text-base sm:text-2xl font-bold text-white whitespace-nowrap">
                        {product.price}
                        <span className="text-xs sm:text-base ml-0.5">₽</span>
                      </span>
                      {product.weight && (
                        <span className="text-[10px] text-gray-500">{product.weight}</span>
                      )}
                    </div>
                  
                    <motion.button
                      onClick={(e) => handleAddToCart(product, e)}
                      whileTap={{ scale: 0.92 }}
                      disabled={isAnimatingButton}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-sm transition-all ${
                        addedToCart === product.id
                          ? 'bg-[#00ff00] text-black'
                          : 'bg-[#252525] text-white hover:bg-[#00ff00] hover:text-black'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      aria-label={`Добавить ${product.name} в корзину`}
                    >
                      <AnimatePresence mode="wait">
                        {addedToCart === product.id ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Check size={18} />
                            <span>Добавлено</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="add"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Plus size={18} />
                            <span className="hidden sm:inline">В корзину</span>
                            <span className="sm:hidden">+</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    
      <div className="mt-8" />

      {/* Модальное окно продукта */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};