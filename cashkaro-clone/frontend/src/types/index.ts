// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'moderator';
  emailVerified: boolean;
  walletBalance: number;
  pendingCashback: number;
  availableCashback: number;
  totalEarnings: number;
  referralCode: string;
  createdAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Store types
export interface Store {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  affiliateUrl: string;
  trackingUrl?: string;
  cashbackRate: number;
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  status: 'active' | 'inactive' | 'pending';
  cashbackRates?: {
    default: number;
    categories: Record<string, number>;
  };
  terms?: string[];
  howToClaim?: string[];
  categories: Category[];
  offers?: Offer[];
  totalClicks: number;
  totalOrders: number;
  totalRevenue: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  isActive: boolean;
  priority: number;
}

// Offer types
export interface Offer {
  id: string;
  title: string;
  description?: string;
  type: 'coupon' | 'deal' | 'cashback';
  code?: string;
  discount?: number;
  discountType?: string;
  minimumPurchase?: number;
  maximumDiscount?: number;
  validFrom?: string;
  validTill?: string;
  terms?: string[];
  isExclusive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  status: 'active' | 'expired' | 'upcoming' | 'paused';
  usageCount: number;
  successCount: number;
  storeId: string;
}

// Cashback types
export interface Cashback {
  id: string;
  transactionId: string;
  purchaseAmount: number;
  cashbackRate: number;
  cashbackAmount: number;
  status: 'pending' | 'tracked' | 'confirmed' | 'cancelled' | 'paid';
  clickId?: string;
  orderId?: string;
  expectedConfirmDate?: string;
  confirmedAt?: string;
  paidAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  store: Store;
}

// Withdrawal types
export interface Withdrawal {
  id: string;
  withdrawalId: string;
  amount: number;
  method: 'bank_transfer' | 'upi' | 'paytm' | 'gift_voucher';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentDetails: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
    paytmNumber?: string;
    voucherCode?: string;
  };
  transactionReference?: string;
  processedAt?: string;
  failureReason?: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Filter and Search types
export interface StoreFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  sort?: 'name' | 'cashback' | 'popular' | 'priority';
  page?: number;
  limit?: number;
}

export interface CashbackFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Dashboard types
export interface CashbackSummary {
  pending: number;
  confirmed: number;
  available: number;
  totalEarnings: number;
  transactions: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}