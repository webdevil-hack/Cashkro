// path: backend/src/models/click.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IClickMeta {
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  browser?: string;
  os?: string;
}

export interface IClick extends Document {
  _id: string;
  userId?: string;
  sessionId: string;
  storeId: string;
  couponId?: string;
  affiliateNetwork: 'admitad' | 'impact' | 'cuelinks' | 'flipkart' | 'amazon' | 'custom';
  clickToken: string;
  redirectUrl: string;
  status: 'pending' | 'converted' | 'rejected' | 'expired';
  conversionValue?: number;
  commissionEarned?: number;
  orderId?: string;
  meta: IClickMeta;
  expiresAt: Date;
  convertedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const clickMetaSchema = new Schema<IClickMeta>({
  userAgent: String,
  ipAddress: String,
  referrer: String,
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  deviceType: {
    type: String,
    enum: ['mobile', 'desktop', 'tablet']
  },
  browser: String,
  os: String
}, { _id: false });

const clickSchema = new Schema<IClick>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    index: true
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store ID is required']
  },
  couponId: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null
  },
  affiliateNetwork: {
    type: String,
    enum: ['admitad', 'impact', 'cuelinks', 'flipkart', 'amazon', 'custom'],
    required: [true, 'Affiliate network is required']
  },
  clickToken: {
    type: String,
    required: [true, 'Click token is required'],
    unique: true,
    index: true
  },
  redirectUrl: {
    type: String,
    required: [true, 'Redirect URL is required'],
    match: [/^https?:\/\/.+/, 'Redirect URL must be a valid URL']
  },
  status: {
    type: String,
    enum: ['pending', 'converted', 'rejected', 'expired'],
    default: 'pending'
  },
  conversionValue: {
    type: Number,
    min: [0, 'Conversion value cannot be negative']
  },
  commissionEarned: {
    type: Number,
    min: [0, 'Commission earned cannot be negative']
  },
  orderId: {
    type: String,
    trim: true
  },
  meta: {
    type: clickMetaSchema,
    default: {}
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    index: { expireAfterSeconds: 0 } // TTL index
  },
  convertedAt: {
    type: Date,
    default: null
  }
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
clickSchema.index({ clickToken: 1 }, { unique: true });
clickSchema.index({ userId: 1 });
clickSchema.index({ storeId: 1 });
clickSchema.index({ sessionId: 1 });
clickSchema.index({ status: 1 });
clickSchema.index({ affiliateNetwork: 1 });
clickSchema.index({ orderId: 1 });
clickSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL
clickSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
clickSchema.index({ storeId: 1, status: 1, createdAt: -1 });

// Compound index for tracking conversions
clickSchema.index({ 
  storeId: 1, 
  status: 1, 
  createdAt: -1 
});

// Pre-save middleware to set expiration date
clickSchema.pre('save', function(this: IClick) {
  if (this.isNew) {
    // Set expiration to 30 days from now
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
});

// Virtual for isExpired
clickSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Method to mark as converted
clickSchema.methods.markAsConverted = function(orderId: string, conversionValue: number, commissionEarned: number) {
  this.status = 'converted';
  this.orderId = orderId;
  this.conversionValue = conversionValue;
  this.commissionEarned = commissionEarned;
  this.convertedAt = new Date();
  return this.save();
};

// Method to mark as rejected
clickSchema.methods.markAsRejected = function() {
  this.status = 'rejected';
  return this.save();
};

// Static method to find by token
clickSchema.statics.findByToken = function(token: string) {
  return this.findOne({ clickToken: token, status: 'pending' });
};

export const Click = mongoose.model<IClick>('Click', clickSchema);