// path: frontend/lib/api.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
          }
          break;
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((error: string) => {
              toast.error(error);
            });
          } else {
            toast.error(data.message || 'Validation failed.');
          }
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiMethods = {
  // Auth methods
  auth: {
    signup: (data: any) => api.post('/api/auth/signup', data),
    login: (data: any) => api.post('/api/auth/login', data),
    refreshToken: (data: any) => api.post('/api/auth/refresh-token', data),
    getProfile: () => api.get('/api/auth/profile'),
    updateProfile: (data: any) => api.put('/api/auth/profile', data),
    changePassword: (data: any) => api.put('/api/auth/change-password', data),
    logout: () => api.post('/api/auth/logout'),
    deleteAccount: (data: any) => api.delete('/api/auth/account', { data }),
  },

  // Store methods
  stores: {
    getAll: (params?: any) => api.get('/api/stores', { params }),
    getBySlug: (slug: string) => api.get(`/api/stores/${slug}`),
    getFeatured: (params?: any) => api.get('/api/stores/featured', { params }),
    getTrending: (params?: any) => api.get('/api/stores/trending', { params }),
    getCategories: () => api.get('/api/stores/categories'),
    search: (params: any) => api.get('/api/stores/search', { params }),
    getStats: (slug: string) => api.get(`/api/stores/${slug}/stats`),
    getCoupons: (slug: string, params?: any) => api.get(`/api/stores/${slug}/coupons`, { params }),
  },

  // Coupon methods
  coupons: {
    getAll: (params?: any) => api.get('/api/coupons', { params }),
    getById: (id: string) => api.get(`/api/coupons/${id}`),
    getCategories: () => api.get('/api/coupons/categories/list'),
    search: (params: any) => api.get('/api/coupons/search', { params }),
    getExclusive: (params?: any) => api.get('/api/coupons/exclusive/list', { params }),
    trackUsage: (id: string) => api.post(`/api/coupons/${id}/use`),
  },

  // Click tracking methods
  clicks: {
    create: (data: any) => api.post('/api/click', data),
    getStats: (params?: any) => api.get('/api/click/stats', { params }),
  },

  // Transaction methods
  transactions: {
    getUserTransactions: (userId: string, params?: any) => 
      api.get(`/api/transactions/user/${userId}`, { params }),
    getById: (id: string) => api.get(`/api/transactions/${id}`),
    getStats: (params?: any) => api.get('/api/transactions/stats/summary', { params }),
    updateStatus: (id: string, data: any) => api.put(`/api/transactions/${id}/status`, data),
  },

  // Admin methods
  admin: {
    getStats: (params?: any) => api.get('/api/admin/stats', { params }),
    createStore: (data: any) => api.post('/api/admin/stores', data),
    updateStore: (id: string, data: any) => api.put(`/api/admin/stores/${id}`, data),
    createCoupon: (data: any) => api.post('/api/admin/coupons', data),
    updateCoupon: (id: string, data: any) => api.put(`/api/admin/coupons/${id}`, data),
    getUsers: (params?: any) => api.get('/api/admin/users', { params }),
    blockUser: (id: string, data: any) => api.put(`/api/admin/users/${id}/block`, data),
    getReferrals: (params?: any) => api.get('/api/admin/referrals', { params }),
    approveReferral: (id: string, data: any) => api.put(`/api/admin/referrals/${id}/approve`, data),
  },
};

export default api;