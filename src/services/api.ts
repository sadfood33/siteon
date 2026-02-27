// src/services/api.ts
import { UserProfile, Address, Order, Category, EmailSettings, DeliverySettings } from '../types/db';
import { Product } from '../data/products';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, requiresAuth = false, headers = {} } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  // ============================================
  // 🔐 AUTHENTICATION
  // ============================================

  auth: {
    register: async (email: string, password: string, name: string, phone?: string) => {
      const data = await request<{ success: boolean; data: { user: UserProfile; token: string } }>('/auth/register', {
        method: 'POST',
        body: { email, password, name, phone },
      });
      
      if (data.data.token) {
        setToken(data.data.token);
      }
      
      return data.data;
    },

    login: async (email: string, password: string) => {
      const data = await request<{ success: boolean; data: { user: UserProfile; token: string } }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      
      if (data.data.token) {
        setToken(data.data.token);
      }
      
      return data.data;
    },

    logout: async () => {
      removeToken();
    },

    getProfile: async () => {
      const data = await request<{ success: boolean; data: { user: UserProfile } }>('/auth/me', {
        requiresAuth: true,
      });
      return data.data.user;
    },

    updateProfile: async (data: Partial<UserProfile>) => {
      const response = await request<{ success: boolean; data: UserProfile }>('/auth/me', {
        method: 'PUT',
        body: data,
        requiresAuth: true,
      });
      return response.data;
    },
  },

  // ============================================
  // 👤 USER
  // ============================================

  user: {
    getAddresses: async () => {
      const data = await request<{ success: boolean; data: { addresses: Address[] } }>('/addresses', {
        requiresAuth: true,
      });
      return data.data.addresses;
    },

    addAddress: async (address: Omit<Address, 'id'>) => {
      const data = await request<{ success: boolean; data: Address }>('/addresses', {
        method: 'POST',
        body: address,
        requiresAuth: true,
      });
      return data.data;
    },

    updateAddress: async (addressId: string, address: Partial<Address>) => {
      const data = await request<{ success: boolean; data: Address }>(`/addresses/${addressId}`, {
        method: 'PUT',
        body: address,
        requiresAuth: true,
      });
      return data.data;
    },

    removeAddress: async (addressId: string) => {
      await request(`/addresses/${addressId}`, {
        method: 'DELETE',
        requiresAuth: true,
      });
    },

    getOrders: async (userId: string, page: number = 1, limit: number = 10, status?: string) => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status) params.append('status', status);
      
      const data = await request<{ success: boolean; data: { orders: Order[]; pagination: any } }>(`/orders?${params}`, {
        requiresAuth: true,
      });
      return data.data.orders;
    },

    getFavorites: async () => {
      const data = await request<{ success: boolean; data: number[] }>('/favorites', {
        requiresAuth: true,
      });
      return data.data;
    },

    toggleFavorite: async (productId: number) => {
      const data = await request<{ success: boolean; data: number[] }>(`/favorites/${productId}`, {
        method: 'POST',
        requiresAuth: true,
      });
      return data.data;
    },
  },

  // ============================================
  // 🛒 ORDERS
  // ============================================

  orders: {
    create: async (
      userId: string,
      items: any[],
      total: number,
      deliveryAddress: string,
      paymentMethod: 'card' | 'cash',
      customerPhone?: string,
      customerName?: string,
      customerEmail?: string
    ) => {
      const data = await request<{ success: boolean; data: Order }>('/orders', {
        method: 'POST',
        body: {
          userId,
          items,
          total,
          deliveryAddress,
          paymentMethod,
          customerPhone,
          customerName,
          customerEmail
        },
        requiresAuth: true,
      });
      return data.data;
    },
  },

  // ============================================
  // 📦 PRODUCTS
  // ============================================

  products: {
    getAll: async (params?: {
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      badge?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams();
      
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params?.badge) queryParams.append('badge', params.badge);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = queryString ? `/products?${queryString}` : '/products';

      const data = await request<{ success: boolean; data: { products: Product[]; pagination: any } }>(url);
      return data.data;
    },

    getById: async (id: number) => {
      const data = await request<{ success: boolean; data: Product }>(`/products/${id}`);
      return data.data;
    },

    create: async (product: Omit<Product, 'id'>) => {
      const data = await request<{ success: boolean; data: Product }>('/products', {
        method: 'POST',
        body: product,
        requiresAuth: true,
      });
      return data.data;
    },

    update: async (id: number, product: Partial<Product>) => {
      const data = await request<{ success: boolean; data: Product }>(`/products/${id}`, {
        method: 'PUT',
        body: product,
        requiresAuth: true,
      });
      return data.data;
    },

    delete: async (id: number) => {
      await request(`/products/${id}`, {
        method: 'DELETE',
        requiresAuth: true,
      });
    },
  },

  // ============================================
  // 📂 CATEGORIES
  // ============================================

  categories: {
    getAll: async () => {
      const data = await request<{ success: boolean; data: { categories: Category[] } }>('/categories');
      return data.data.categories;
    },

    create: async (category: Omit<Category, 'id'>) => {
      const data = await request<{ success: boolean; data: Category }>('/categories', {
        method: 'POST',
        body: category,
        requiresAuth: true,
      });
      return data.data;
    },

    update: async (id: string, category: Partial<Category>) => {
      const data = await request<{ success: boolean; data: Category }>(`/categories/${id}`, {
        method: 'PUT',
        body: category,
        requiresAuth: true,
      });
      return data.data;
    },

    delete: async (id: string) => {
      await request(`/categories/${id}`, {
        method: 'DELETE',
        requiresAuth: true,
      });
    },
  },

  // ============================================
  // ⚙️ SETTINGS
  // ============================================

  settings: {
    getDelivery: async () => {
      const data = await request<{ success: boolean; data: DeliverySettings }>('/settings/delivery');
      return data.data;
    },

    updateDelivery: async (settings: Partial<DeliverySettings>) => {
      const data = await request<{ success: boolean; data: DeliverySettings }>('/settings/delivery', {
        method: 'PUT',
        body: settings,
        requiresAuth: true,
      });
      return data.data;
    },
  },

  // ============================================
  // 👨‍💼 ADMIN
  // ============================================

  admin: {
    getOrders: async (page: number = 1, limit: number = 20, status?: string, startDate?: string, endDate?: string) => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) params.append('status', status);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const data = await request<{ success: boolean; data: { orders: Order[]; pagination: any } }>(`/admin/orders?${params}`, {
        requiresAuth: true,
      });
      return data.data;
    },

    updateOrderStatus: async (orderId: string, status: Order['status']) => {
      const data = await request<{ success: boolean; data: Order }>(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: { status },
        requiresAuth: true,
      });
      return data.data;
    },

    getEmailSettings: async () => {
      const data = await request<{ success: boolean; data: EmailSettings }>('/admin/email-settings', {
        requiresAuth: true,
      });
      return data.data;
    },

    saveEmailSettings: async (settings: EmailSettings) => {
      const data = await request<{ success: boolean; data: EmailSettings }>('/admin/email-settings', {
        method: 'PUT',
        body: settings,
        requiresAuth: true,
      });
      return data.data;
    },

    getAnalytics: async (startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const data = await request<{ success: boolean; data: any }>(`/admin/analytics?${params}`, {
        requiresAuth: true,
      });
      return data.data;
    },
  },

  // ============================================
  // 🏥 HEALTH
  // ============================================

  health: {
    check: async () => {
      const data = await request<{ status: string; timestamp: string }>('/health');
      return data;
    },
  },
};

export default api;