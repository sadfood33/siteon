// src/types/db.ts
export interface Address {
  id: string;
  title: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  intercom?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'cooking' | 'delivering' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: 'card' | 'cash';
  // Новые поля для клиента
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user';
  addresses: Address[];
  favorites: number[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface EmailSettings {
  adminEmail: string;
  senderName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  useSSL: boolean;
  notificationOnNewOrder: boolean;
  welcomeEmailEnabled: boolean;
}

export interface DeliverySettings {
  freeDeliveryThreshold: number;
  deliveryFee: number;
  estimatedTime: string;
  isDeliveryEnabled: boolean;
  deliveryZones?: DeliveryZone[];
}

export interface DeliveryZone {
  id: number;
  name: string;
  fee: number;
  estimatedTime: string;
}