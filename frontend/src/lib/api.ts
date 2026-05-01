import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Request interceptor — attach JWT
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          try {
            const auth = JSON.parse(localStorage.getItem('tiles-auth') || '{}');
            if (auth?.state?.token) {
              config.headers.Authorization = `Bearer ${auth.state.token}`;
            }
          } catch {}
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor — handle 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('tiles-auth');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  async upload<T>(url: string, formData: FormData): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

export const api = new ApiClient();

// ==================== AUTH APIs ====================
export const authApi = {
  sendOtp: (phone: string) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone: string, otp: string) =>
    api.post('/auth/verify-otp', { phone, otp }),
  register: (data: object) => api.post('/auth/register', data),
  googleLogin: (token: string) => api.post('/auth/google', { token }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// ==================== INSURANCE APIs ====================
export const insuranceApi = {
  getPlans: (category: string, params?: object) =>
    api.get(`/insurance/${category}`, { params }),
  getPlanById: (id: number) => api.get(`/insurance/plans/${id}`),
  comparePlans: (ids: number[]) => api.post('/insurance/compare', { ids }),
  calculatePremium: (data: object) => api.post('/insurance/calculate-premium', data),
  getInsurers: () => api.get('/insurers'),
};

// ==================== QUOTE APIs ====================
export const quoteApi = {
  createQuote: (data: object) => api.post('/quotes', data),
  getQuote: (id: number) => api.get(`/quotes/${id}`),
  shareQuote: (id: number, channels: string[]) =>
    api.post(`/quotes/${id}/share`, { channels }),
};

// ==================== POLICY APIs ====================
export const policyApi = {
  getUserPolicies: () => api.get('/policies'),
  getPolicyById: (id: number) => api.get(`/policies/${id}`),
  purchasePolicy: (data: object) => api.post('/policies/purchase', data),
  downloadPolicy: (id: number) => api.get(`/policies/${id}/download`),
  renewPolicy: (id: number) => api.post(`/policies/${id}/renew`),
  uploadKyc: (formData: FormData) => api.upload('/kyc/upload', formData),
};

// ==================== CLAIM APIs ====================
export const claimApi = {
  getUserClaims: () => api.get('/claims'),
  getClaimById: (id: number) => api.get(`/claims/${id}`),
  raiseClaim: (data: object) => api.post('/claims', data),
  uploadClaimDoc: (claimId: number, formData: FormData) =>
    api.upload(`/claims/${claimId}/documents`, formData),
  getClaimTimeline: (claimId: number) => api.get(`/claims/${claimId}/timeline`),
};

// ==================== AGENT APIs ====================
export const agentApi = {
  getProfile: () => api.get('/agent/profile'),
  updateProfile: (data: object) => api.put('/agent/profile', data),
  getLeads: (params?: object) => api.get('/agent/leads', { params }),
  createLead: (data: object) => api.post('/agent/leads', data),
  updateLead: (id: number, data: object) => api.put(`/agent/leads/${id}`, data),
  getClients: () => api.get('/agent/clients'),
  getCommissions: (params?: object) => api.get('/agent/commissions', { params }),
  getStats: () => api.get('/agent/stats'),
  getRenewals: () => api.get('/agent/renewals'),
  generateQuote: (data: object) => api.post('/agent/quotes', data),
  shareQuote: (id: number, data: object) => api.post(`/agent/quotes/${id}/share`, data),
  getCourses: () => api.get('/agent/training/courses'),
  enrollCourse: (courseId: number) => api.post(`/agent/training/courses/${courseId}/enroll`),
};

// ==================== ADMIN APIs ====================
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: object) => api.get('/admin/users', { params }),
  updateUser: (id: number, data: object) => api.put(`/admin/users/${id}`, data),
  getAgents: (params?: object) => api.get('/admin/agents', { params }),
  approveKyc: (id: number) => api.post(`/admin/kyc/${id}/approve`),
  rejectKyc: (id: number, reason: string) =>
    api.post(`/admin/kyc/${id}/reject`, { reason }),
  getPolicies: (params?: object) => api.get('/admin/policies', { params }),
  getClaims: (params?: object) => api.get('/admin/claims', { params }),
  approveClaim: (id: number, amount: number) =>
    api.post(`/admin/claims/${id}/approve`, { amount }),
  rejectClaim: (id: number, reason: string) =>
    api.post(`/admin/claims/${id}/reject`, { reason }),
  getInsurers: () => api.get('/admin/insurers'),
  createInsurer: (data: object) => api.post('/admin/insurers', data),
  updateInsurer: (id: number, data: object) => api.put(`/admin/insurers/${id}`, data),
  getAnalytics: (period: string) => api.get('/admin/analytics', { params: { period } }),
  getCommissions: (params?: object) => api.get('/admin/commissions', { params }),
  getPosts: (params?: object) => api.get('/admin/cms/posts', { params }),
  createPost: (data: object) => api.post('/admin/cms/posts', data),
  updatePost: (id: number, data: object) => api.put(`/admin/cms/posts/${id}`, data),
  deletePost: (id: number) => api.delete(`/admin/cms/posts/${id}`),
};

// ==================== BLOG APIs ====================
export const blogApi = {
  getPosts: (params?: object) => api.get('/blog/posts', { params }),
  getPostBySlug: (slug: string) => api.get(`/blog/posts/${slug}`),
  getCategories: () => api.get('/blog/categories'),
};

// ==================== ADVISOR APIs ====================
export const advisorApi = {
  findNearby: (lat: number, lng: number) =>
    api.get('/advisors/nearby', { params: { lat, lng } }),
  bookCall: (data: object) => api.post('/advisors/book-call', data),
  sendMessage: (data: object) => api.post('/chat/messages', data),
  getMessages: (roomId: string) => api.get(`/chat/rooms/${roomId}/messages`),
};

// ==================== NOTIFICATION APIs ====================
export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id: number) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};
