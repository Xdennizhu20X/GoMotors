/**
 * API Client Configuration for RUEDA YA!
 * Handles all backend communication with JWT authentication
 */


interface ApiConfig {
  baseURL: string;
  headers: HeadersInit;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = config.headers;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  public clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers = new Headers({
      ...this.defaultHeaders as Record<string, string>,
      ...(options.headers as Record<string, string>),
    });

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const url = `${this.baseURL}${endpoint}`;
      // console.log('API Request:', {
      //   url,
      //   method: options.method || 'GET',
      //   headers: Object.fromEntries(headers.entries()),
      //   body: options.body
      // });

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // console.log('API Response Status:', response.status, response.statusText);

      let data;
      try {
        data = await response.json();
        // console.log('API Response Data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        data = {};
      }

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          details: data?.error?.details
        });

        if (response.status === 401) {
          this.clearAuthToken();
          if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
            window.location.href = '/auth';
          }
        }
        throw data;
      }

      return data;
    } catch (error: any) {
      console.error('API Request Error:', error);
      if (error.error) {
        throw error;
      }
      throw {
        error: {
          code: 'NETWORK_ERROR',
          message: 'Error de conexión con el servidor',
          details: [error.message],
        },
      };
    }
  }

  // GET request
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  // POST request
  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // Auth specific methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    avatar?: string;
  }): Promise<ApiResponse> {
    const response = await this.post('/auth/register', userData);
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    const response = await this.post('/auth/login', credentials);
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.post('/auth/logout');
    this.clearAuthToken();
    return response;
  }

  async getMe(): Promise<ApiResponse> {
    return this.get('/auth/me');
  }

  async updatePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return this.put('/auth/password', passwords);
  }

  // User profile methods
  async getProfile(): Promise<ApiResponse> {
    return this.get('/users/profile');
  }

  async updateProfile(profileData: any): Promise<ApiResponse> {
    return this.put('/users/profile', profileData);
  }

  // Wishlist methods
  async getWishlist(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse> {
    return this.get('/wishlist', params);
  }

  async addToWishlist(vehicleId: string, notes?: string, priority?: number): Promise<ApiResponse> {
    return this.post('/wishlist', { vehicleId, notes, priority });
  }

  async removeFromWishlist(vehicleId: string): Promise<ApiResponse> {
    return this.delete(`/wishlist/vehicle/${vehicleId}`);
  }

  async checkWishlistStatus(vehicleId: string): Promise<ApiResponse> {
    return this.get(`/wishlist/check/${vehicleId}`);
  }

  async updateWishlistItem(id: string, data: { notes?: string; priority?: number; status?: string }): Promise<ApiResponse> {
    return this.put(`/wishlist/${id}`, data);
  }

  async getWishlistStats(): Promise<ApiResponse> {
    return this.get('/wishlist/stats');
  }

  // Purchase history
  async getPurchaseHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse> {
    return this.get('/users/purchases', params);
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse> {
    return this.get('/users/notifications');
  }

  async updateNotificationPreferences(preferences: {
    notifications: boolean;
    newsletter: boolean;
  }): Promise<ApiResponse> {
    return this.put('/users/notification-preferences', preferences);
  }

  // Vehicles (placeholder endpoints)
  async getVehicles(params?: any): Promise<ApiResponse> {
    return this.get('/vehicles', params);
  }

  async getVehicleById(id: string): Promise<ApiResponse> {
    return this.get(`/vehicles/${id}`);
  }

  async compareVehicles(vehicleIds: string[]): Promise<ApiResponse> {
    return this.post('/vehicles/compare', { vehicleIds });
  }

  // Dealers (placeholder endpoints)
  async getDealers(params?: any): Promise<ApiResponse> {
    return this.get('/dealers', params);
  }

  async getDealerById(id: string): Promise<ApiResponse> {
    const response = await this.get(`/dealers/${id}`);
    if (response.success && response.data) {
      // Normalize dealer data to ensure id field is available
      const normalizedDealer = {
        ...response.data,
        id: response.data._id || response.data.id, // Use _id from API or fallback to id
      };
      return {
        ...response,
        data: normalizedDealer
      };
    }
    return response;
  }

  async getDealerBySlug(slug: string): Promise<ApiResponse> {
    // Use the backend slug endpoint - it handles auto-generation and fallbacks
    const response = await this.get(`/dealers/slug/${slug}`);

    if (response.success && response.data) {
      // Ensure id field is available for frontend compatibility
      const normalizedDealer = {
        ...response.data,
        id: response.data._id || response.data.id,
      };
      return {
        ...response,
        data: normalizedDealer
      };
    }

    return response;
  }

  async getAllDealers(): Promise<ApiResponse> {
    return this.get('/dealers');
  }

  // Search (placeholder endpoints)
  async search(query: string, type?: string, page?: number, limit?: number): Promise<ApiResponse> {
    return this.get('/search', { q: query, type, page, limit });
  }

  async getSearchSuggestions(query: string): Promise<ApiResponse> {
    return this.get('/search/suggestions', { q: query });
  }

  async getFilters(): Promise<ApiResponse> {
    return this.get('/filters');
  }

  // Financing (placeholder endpoints)
  async calculateFinancing(data: any): Promise<ApiResponse> {
    return this.post('/financing/calculate', data);
  }

  async applyForFinancing(application: any): Promise<ApiResponse> {
    return this.post('/financing/applications', application);
  }

  // Purchases - Complete implementation
  async createPurchase(purchaseData: {
    vehicleId: string;
    vehicleName: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: number;
    vehiclePrice: number;
    selectedColor: string;
    dealerId?: string; // Solo string válido, no null
    dealerName: string;
    dealerLocation: string;
    paymentMethod: 'cash' | 'financing';
    financingDetails?: {
      downPayment: number;
      loanAmount: number;
      loanTerms: number;
      monthlyPayment: number;
      interestRate: number;
      totalInterest: number;
      totalAmount: number;
    };
    totalPrice: number;
    purchaseDate: string;
  }): Promise<ApiResponse> {
    return this.post('/purchases', purchaseData);
  }

  async processBilling(purchaseId: string, billingData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    postalCode: string;
    paymentType: 'card' | 'bank_transfer';
    cardDetails?: {
      cardNumber: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
    };
    bankDetails?: {
      selectedBank: string;
      accountType?: string;
    };
    savePaymentInfo?: boolean;
    receiveNotifications?: boolean;
  }): Promise<ApiResponse> {
    return this.post(`/purchases/${purchaseId}/billing`, billingData);
  }

  async getPurchases(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse> {
    return this.get('/purchases', params);
  }

  async getPurchaseById(id: string): Promise<ApiResponse> {
    return this.get(`/purchases/${id}`);
  }

  async cancelPurchase(id: string, reason?: string): Promise<ApiResponse> {
    return this.delete(`/purchases/${id}`, reason ? { reason } : undefined);
  }

  // Payment methods
  async getUserPaymentMethods(): Promise<ApiResponse> {
    return this.get('/users/payment-methods');
  }

  // Shipping (placeholder endpoints)
  async calculateShipping(data: any): Promise<ApiResponse> {
    return this.post('/shipping/calculate', data);
  }

  // Health check
  async checkHealth(): Promise<ApiResponse> {
    return this.get('/health');
  }

  // Analytics endpoints
  async sendAnalyticsEvent(eventData: {
    event_type: string;
    event_data: any;
    session_id: string;
    user_id?: string | null;
    timestamp: string;
    page_url: string;
    page_referrer: string;
    screen_resolution: string;
    viewport_size: string;
    timezone: string;
    language: string;
  }): Promise<ApiResponse> {
    return this.post('/analytics/events', eventData);
  }

  async getAnalytics(params?: {
    start_date?: string;
    end_date?: string;
    event_type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    return this.get('/analytics', params);
  }

  async getAnalyticsSummary(params?: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse> {
    return this.get('/analytics/summary', params);
  }

  async getPopularVehicles(params?: {
    start_date?: string;
    end_date?: string;
    limit?: number;
  }): Promise<ApiResponse> {
    return this.get('/analytics/popular-vehicles', params);
  }

  async getDealerAnalytics(dealerId: string, params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse> {
    return this.get(`/analytics/dealers/${dealerId}`, params);
  }

  // Reviews methods
  async getDealerReviews(dealerId: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ApiResponse> {
    return this.get(`/dealers/${dealerId}/reviews`, params);
  }

  async createReview(dealerId: string, reviewData: {
    rating: number;
    comment: string;
  }): Promise<ApiResponse> {
    return this.post(`/dealers/${dealerId}/reviews`, reviewData);
  }

  async getUserReviews(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    return this.get('/reviews/my-reviews', params);
  }

  async updateReview(reviewId: string, reviewData: {
    rating: number;
    comment: string;
  }): Promise<ApiResponse> {
    return this.put(`/reviews/${reviewId}`, reviewData);
  }

  async deleteReview(reviewId: string): Promise<ApiResponse> {
    return this.delete(`/reviews/${reviewId}`);
  }

  async markReviewHelpful(reviewId: string): Promise<ApiResponse> {
    return this.post(`/reviews/${reviewId}/helpful`);
  }

  async reportReview(reviewId: string): Promise<ApiResponse> {
    return this.post(`/reviews/${reviewId}/report`);
  }

  async checkUserReview(dealerId: string): Promise<ApiResponse> {
    return this.get(`/dealers/${dealerId}/reviews/check-user`);
  }

  // Dealer Configuration methods
  async getDealerConfiguration(dealerId: string, version?: number): Promise<ApiResponse> {
    return this.get(`/dealers/${dealerId}/configuration`, version ? { version } : undefined);
  }

  async getCompleteDealerConfiguration(dealerId: string): Promise<ApiResponse> {
    return this.get(`/dealers/${dealerId}/configuration/complete`);
  }
}

// Create and export singleton instance
const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
export type { ApiResponse };