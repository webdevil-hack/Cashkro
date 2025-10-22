// path: backend/src/models/store.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAffiliateLink {
  network: 'admitad' | 'impact' | 'cuelinks' | 'flipkart' | 'amazon' | 'custom';
  link: string;
  partnerId: string;
  isActive: boolean;
  commissionRate?: number;
}

export interface IStoreStats {
  clicks: number;
  conversions: number;
  totalCashback: number;
  lastUpdated: Date;
}

export interface IStore extends Document {
  _id: string;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl?: string;
  description?: string;
  categories: string[];
  currentCashbackPercent: number;
  cashbackType: 'percent' | 'fixed';
  minOrderValue?: number;
  maxCashback?: number;
  affiliateLinks: IAffiliateLink[];
  stats: IStoreStats;
  active: boolean;
  featured: boolean;
  terms: string;
  website: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const affiliateLinkSchema = new Schema<IAffiliateLink>({
  network: {
    type: String,
    enum: ['admitad', 'impact', 'cuelinks', 'flipkart', 'amazon', 'custom'],
    required: true
  },
  link: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+/, 'Affiliate link must be a valid URL']
  },
  partnerId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  commissionRate: {
    type: Number,
    min: 0,
    max: 100
  }
}, { _id: false });

const storeStatsSchema = new Schema<IStoreStats>({
  clicks: {
    type: Number,
    default: 0,
    min: 0
  },
  conversions: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCashback: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const storeSchema = new Schema<IStore>({
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Store slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  logoUrl: {
    type: String,
    required: [true, 'Logo URL is required'],
    match: [/^https?:\/\/.+/, 'Logo URL must be a valid URL']
  },
  bannerUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Banner URL must be a valid URL']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  categories: [{
    type: String,
    required: true,
    trim: true
  }],
  currentCashbackPercent: {
    type: Number,
    required: [true, 'Cashback percentage is required'],
    min: [0, 'Cashback percentage cannot be negative'],
    max: [100, 'Cashback percentage cannot exceed 100%']
  },
  cashbackType: {
    type: String,
    enum: ['percent', 'fixed'],
    default: 'percent'
  },
  minOrderValue: {
    type: Number,
    min: [0, 'Minimum order value cannot be negative']
  },
  maxCashback: {
    type: Number,
    min: [0, 'Maximum cashback cannot be negative']
  },
  affiliateLinks: [affiliateLinkSchema],
  stats: {
    type: storeStatsSchema,
    default: () => ({
      clicks: 0,
      conversions: 0,
      totalCashback: 0,
      lastUpdated: new Date()
    })
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  terms: {
    type: String,
    required: [true, 'Terms and conditions are required']
  },
  website: {
    type: String,
    required: [true, 'Website URL is required'],
    match: [/^https?:\/\/.+/, 'Website URL must be a valid URL']
  },
  appStoreUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'App Store URL must be a valid URL']
  },
  playStoreUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Play Store URL must be a valid URL']
  },
  socialLinks: {
    facebook: {
      type: String,
      match: [/^https?:\/\/.+/, 'Facebook URL must be a valid URL']
    },
    twitter: {
      type: String,
      match: [/^https?:\/\/.+/, 'Twitter URL must be a valid URL']
    },
    instagram: {
      type: String,
      match: [/^https?:\/\/.+/, 'Instagram URL must be a valid URL']
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
storeSchema.index({ slug: 1 }, { unique: true });
storeSchema.index({ name: 1 });
storeSchema.index({ categories: 1 });
storeSchema.index({ active: 1 });
storeSchema.index({ featured: 1 });
storeSchema.index({ currentCashbackPercent: -1 });
storeSchema.index({ 'stats.clicks': -1 });
storeSchema.index({ tags: 1 });
storeSchema.index({ createdAt: -1 });

// Generate slug from name before saving
storeSchema.pre('save', function(this: IStore) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
});

// Virtual for conversion rate
storeSchema.virtual('conversionRate').get(function() {
  if (this.stats.clicks === 0) return 0;
  return (this.stats.conversions / this.stats.clicks) * 100;
});

export const Store = mongoose.model<IStore>('Store', storeSchema);