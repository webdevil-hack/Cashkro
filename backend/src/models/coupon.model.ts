// path: backend/src/models/coupon.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  _id: string;
  storeId: string;
  title: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiryDate: Date;
  isExclusive: boolean;
  usageCount: number;
  maxUsage?: number;
  isActive: boolean;
  category: string;
  terms: string;
  imageUrl?: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store ID is required']
  },
  title: {
    type: String,
    required: [true, 'Coupon title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    trim: true,
    uppercase: true,
    maxlength: [50, 'Code cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minOrderValue: {
    type: Number,
    min: [0, 'Minimum order value cannot be negative']
  },
  maxDiscount: {
    type: Number,
    min: [0, 'Maximum discount cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function(this: ICoupon, value: Date) {
        return value > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  isExclusive: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  maxUsage: {
    type: Number,
    min: [1, 'Maximum usage must be at least 1']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  terms: {
    type: String,
    required: [true, 'Terms and conditions are required'],
    trim: true
  },
  imageUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Image URL must be a valid URL']
  },
  priority: {
    type: Number,
    default: 0,
    min: [0, 'Priority cannot be negative']
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
couponSchema.index({ storeId: 1 });
couponSchema.index({ code: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ isExclusive: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ category: 1 });
couponSchema.index({ priority: -1 });
couponSchema.index({ createdAt: -1 });
couponSchema.index({ storeId: 1, isActive: 1, expiryDate: 1 });

// Compound index for active coupons by store
couponSchema.index({ 
  storeId: 1, 
  isActive: 1, 
  expiryDate: 1, 
  priority: -1 
});

// Virtual for isExpired
couponSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual for isAvailable
couponSchema.virtual('isAvailable').get(function() {
  if (!this.isActive || this.isExpired) return false;
  if (this.maxUsage && this.usageCount >= this.maxUsage) return false;
  return true;
});

// Pre-save middleware to update usage count
couponSchema.pre('save', function(this: ICoupon) {
  if (this.isModified('usageCount') && this.maxUsage) {
    if (this.usageCount >= this.maxUsage) {
      this.isActive = false;
    }
  }
});

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);