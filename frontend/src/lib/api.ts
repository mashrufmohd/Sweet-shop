const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiError {
  message: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  // Auth
  async register(data: { name: string; email: string; password: string; is_admin?: boolean }) {
    return this.request<{ result: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ result: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Sweets
  async getSweets() {
    return this.request<Sweet[]>('/sweets');
  }

  async searchSweets(query: string) {
    return this.request<Sweet[]>(`/sweets/search?q=${encodeURIComponent(query)}`);
  }

  async createSweet(data: Omit<Sweet, '_id' | 'owner_email' | 'createdAt' | 'updatedAt'>) {
    return this.request<Sweet>('/sweets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSweet(id: string, data: Partial<Sweet>) {
    return this.request<Sweet>(`/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSweet(id: string) {
    return this.request<{ message: string }>(`/sweets/${id}`, {
      method: 'DELETE',
    });
  }

  async purchaseSweet(id: string, quantity: number = 1) {
    return this.request<{ message: string; sweet: Sweet }>(`/sweets/${id}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async restockSweet(id: string, quantity: number) {
    return this.request<Sweet>(`/sweets/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async uploadImage(file: File) {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/sweets/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json() as Promise<{ image_url: string }>;
  }

  // Orders
  async createOrder(data: { items: OrderItem[]; total: number }) {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyOrders() {
    return this.request<Order[]>('/orders/my-orders');
  }

  async getAllOrders() {
    return this.request<Order[]>('/orders');
  }

  // Analytics
  async getDashboardAnalytics() {
    return this.request<DashboardAnalytics>('/analytics/dashboard');
  }
}

export const api = new ApiClient();

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  is_admin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image_url?: string;
  owner_email: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  sweet_id: string;
  sweet_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user_email: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  topSellingProducts: { _id: string; totalSold: number }[];
}
