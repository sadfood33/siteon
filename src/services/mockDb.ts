// src/services/mockDb.ts
import { UserProfile, Order, Address, EmailSettings } from '../types/db';
const STORAGE_KEYS = {
  USERS: 'db_users',
  ORDERS: 'db_orders',
  PRODUCTS: 'products',
  EMAIL_SETTINGS: 'db_email_settings',
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockDatabase {
  private getUsers(): UserProfile[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: UserProfile[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  private getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  private saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  async findUserByEmail(email: string): Promise<UserProfile | undefined> {
    await delay(300);
    const users = this.getUsers();
    return users.find((u) => u.email === email);
  }

  async createUser(email: string, name: string): Promise<UserProfile> {
    await delay(500);
    const users = this.getUsers();
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: email === 'admin@sadfood.com' ? 'admin' : 'user',
      addresses: [],
      favorites: [],
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await delay(400);
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    this.saveUsers(users);
    return updatedUser;
  }

  async addAddress(userId: string, address: Omit<Address, 'id'>): Promise<Address> {
    await delay(300);
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const newAddress: Address = {
      ...address,
      id: Math.random().toString(36).substr(2, 9),
    };

    users[userIndex].addresses.push(newAddress);
    this.saveUsers(users);
    return newAddress;
  }

  async removeAddress(userId: string, addressId: string): Promise<void> {
    await delay(300);
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    users[userIndex].addresses = users[userIndex].addresses.filter((a) => a.id !== addressId);
    this.saveUsers(users);
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    await delay(800);
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'processing',
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    await delay(400);
    const orders = this.getOrders();
    return orders.filter((o) => o.userId === userId);
  }

  // Новые методы для админки
  async getAdminOrders(
    page: number = 1, 
    limit: number = 20, 
    status?: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<{ orders: Order[]; pagination: any }> {
    await delay(400);
    let orders = this.getOrders();

    // Фильтрация по статусу
    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    // Фильтрация по дате
    if (startDate || endDate) {
      orders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        if (startDate && orderDate < new Date(startDate)) return false;
        if (endDate && orderDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Пагинация
    const total = orders.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOrders = orders.slice(start, end);

    // Добавляем информацию о пользователе
    const users = this.getUsers();
    const ordersWithUsers = paginatedOrders.map(order => {
      const user = users.find(u => u.id === order.userId);
      return {
        ...order,
        customerName: user?.name || 'Клиент',
        customerPhone: user?.phone || order.customerPhone || 'Не указан',
        customerEmail: user?.email || 'Не указан'
      };
    });

    return {
      orders: ordersWithUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    await delay(300);
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index === -1) throw new Error('Order not found');
    
    orders[index].status = status;
    this.saveOrders(orders);
    
    // Добавляем информацию о пользователе
    const user = this.getUsers().find(u => u.id === orders[index].userId);
    return {
      ...orders[index],
      customerName: user?.name || 'Клиент',
      customerPhone: user?.phone || orders[index].customerPhone || 'Не указан',
      customerEmail: user?.email || 'Не указан'
    };
  }

  async getEmailSettings(): Promise<EmailSettings> {
    await delay(200);
    const data = localStorage.getItem(STORAGE_KEYS.EMAIL_SETTINGS);
    return data ? JSON.parse(data) : {
      adminEmail: 'admin@sadfood.online',
      senderName: 'S.A.D. Food Delivery',
      smtpHost: 'smtp.yandex.ru',
      smtpPort: 465,
      smtpUser: 'sadfood@yandex.ru',
      smtpPass: '********',
      useSSL: true,
      notificationOnNewOrder: true,
      welcomeEmailEnabled: true,
    };
  }

  async saveEmailSettings(settings: EmailSettings): Promise<void> {
    await delay(500);
    localStorage.setItem(STORAGE_KEYS.EMAIL_SETTINGS, JSON.stringify(settings));
  }

  async getAnalytics(startDate?: string, endDate?: string): Promise<any> {
    await delay(400);
    let orders = this.getOrders();

    if (startDate || endDate) {
      orders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        if (startDate && orderDate < new Date(startDate)) return false;
        if (endDate && orderDate > new Date(endDate)) return false;
        return true;
      });
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const ordersByStatus = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus,
      period: { startDate, endDate }
    };
  }
}

export const db = new MockDatabase();