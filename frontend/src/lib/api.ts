import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  resendVerification: () => api.post('/auth/resend-verification'),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/password', data),
  getWallet: () => api.get('/users/wallet'),
  getTransactions: (params?: any) => api.get('/users/transactions', { params }),
  getReferrals: () => api.get('/users/referrals'),
  uploadAvatar: (file: FormData) => api.post('/users/avatar', file),
  deleteAccount: () => api.delete('/users/account'),
}

export const storeAPI = {
  getStores: (params?: any) => api.get('/stores', { params }),
  getStore: (slug: string) => api.get(`/stores/${slug}`),
  getFeaturedStores: (limit?: number) =>
    api.get('/stores/featured', { params: { limit } }),
  getStoresByCategory: (category: string, params?: any) =>
    api.get(`/stores/category/${category}`, { params }),
  searchStores: (query: string, params?: any) =>
    api.get('/stores/search', { params: { q: query, ...params } }),
  trackClick: (storeId: string) => api.post(`/stores/${storeId}/click`),
  addToFavorites: (storeId: string) =>
    api.post(`/stores/${storeId}/favorite`),
  removeFromFavorites: (storeId: string) =>
    api.delete(`/stores/${storeId}/favorite`),
  getFavorites: (params?: any) => api.get('/stores/favorites', { params }),
}

export const couponAPI = {
  getCoupons: (params?: any) => api.get('/coupons', { params }),
  getCoupon: (id: string) => api.get(`/coupons/${id}`),
  getStoreCoupons: (storeId: string) => api.get(`/coupons/store/${storeId}`),
  searchCoupons: (query: string, params?: any) =>
    api.get('/coupons/search', { params: { q: query, ...params } }),
  validateCoupon: (id: string) => api.post(`/coupons/${id}/validate`),
}

export const dealAPI = {
  getDeals: (params?: any) => api.get('/deals', { params }),
  getDeal: (id: string) => api.get(`/deals/${id}`),
  getFeaturedDeals: (limit?: number) =>
    api.get('/deals/featured', { params: { limit } }),
  getStoreDeals: (storeId: string) => api.get(`/deals/store/${storeId}`),
  searchDeals: (query: string, params?: any) =>
    api.get('/deals/search', { params: { q: query, ...params } }),
}

export const transactionAPI = {
  createTransaction: (data: any) => api.post('/transactions', data),
  getTransactions: (params?: any) => api.get('/transactions', { params }),
  getTransaction: (id: string) => api.get(`/transactions/${id}`),
}

export const cashbackAPI = {
  getCashbacks: (params?: any) => api.get('/cashback', { params }),
  getCashback: (id: string) => api.get(`/cashback/${id}`),
}

export const withdrawalAPI = {
  createWithdrawal: (data: any) => api.post('/withdrawals', data),
  getWithdrawals: (params?: any) => api.get('/withdrawals', { params }),
  getWithdrawal: (id: string) => api.get(`/withdrawals/${id}`),
  getMethods: () => api.get('/withdrawals/methods'),
}