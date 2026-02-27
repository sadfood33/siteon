import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/products';
import { useToast } from './ToastContext';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { ...product, quantity }];
    });
    // Быстрое уведомление на 0.5 секунды (500ms) - не открываем корзину
    showToast(`${product.name} добавлен в корзину`, 'success', 500);
  };

  const removeFromCart = (productId: number) => {
    setItems(current => current.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Total будет рассчитываться с учетом доставки в компонентах
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, total, count, isOpen, setIsOpen, isCheckoutOpen, setIsCheckoutOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
