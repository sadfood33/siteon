import { Home, Utensils, Truck, Phone, Pizza } from 'lucide-react';

export const navigation = [
  { name: 'Главная', path: '/', icon: Home },
  { name: 'Каталог', path: '/catalog', icon: Utensils },
  { name: 'Бизнес-ланч', path: '/#business-lunch', icon: Pizza },
  { name: 'Доставка', path: '/#delivery', icon: Truck },
  { name: 'Контакты', path: '/#contacts', icon: Phone },
];
