export interface Store {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner?: string;
  website: string;
  categories: string[];
  cashbackType: 'percentage' | 'fixed' | 'upto';
  cashbackValue: number;
  maxCashback?: number;
  cashbackTerms?: string;
  rating: number;
  totalRatings: number;
  isFeatured: boolean;
  popularity: number;
}

export interface Deal {
  _id: string;
  title: string;
  description: string;
  store: Store | string;
  image?: string;
  dealType: 'deal' | 'offer' | 'sale';
  discountType: 'percentage' | 'fixed' | 'bogo' | 'other';
  discountValue: string;
  originalPrice?: number;
  salePrice?: number;
  affiliateLink: string;
  expiryDate?: Date;
  terms?: string;
  isFeatured: boolean;
  categories: string[];
  clickCount: number;
}

export interface Coupon {
  _id: string;
  title: string;
  code: string;
  description: string;
  store: Store | string;
  discountType: 'percentage' | 'fixed' | 'freeShipping' | 'other';
  discountValue: string;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate?: Date;
  terms?: string;
  isExclusive: boolean;
  isVerified: boolean;
  categories: string[];
  usageCount: number;
  successRate: number;
}

export interface Cashback {
  _id: string;
  user: string;
  store: Store | string;
  transactionId: string;
  orderAmount: number;
  cashbackAmount: number;
  cashbackRate: number;
  status: 'pending' | 'tracked' | 'confirmed' | 'cancelled' | 'paid';
  clickedAt: Date;
  trackedAt?: Date;
  confirmedAt?: Date;
  paidAt?: Date;
  estimatedConfirmationDate?: Date;
  notes?: string;
}

export interface Withdrawal {
  _id: string;
  amount: number;
  method: 'bank' | 'upi' | 'paytm' | 'amazonPay';
  paymentDetails: any;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  transactionId: string;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
}
