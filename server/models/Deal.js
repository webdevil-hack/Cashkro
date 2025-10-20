const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Deal title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: [true, 'Merchant is required']
  },
  type: {
    type: String,
    required: [true, 'Deal type is required'],
    enum: ['cashback', 'coupon', 'offer', 'sale']
  },
  cashbackRate: {
    type: Number,
    min: [0, 'Cashback rate cannot be negative'],
    max: [100, 'Cashback rate cannot exceed 100%']
  },
  cashbackAmount: {
    type: Number,
    min: [0, 'Cashback amount cannot be negative']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100%']
  },
  discountAmount: {
    type: Number,
    min: [0, 'Discount amount cannot be negative']
  },
  couponCode: String,
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscount: Number,
  maxCashback: Number,
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required']
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isExclusive: { type: Boolean, default: false },
  image: String,
  banner: String,
  terms: String,
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  subcategory: String,
  tags: [String],
  targetAudience: {
    type: String,
    enum: ['all', 'new_users', 'existing_users', 'premium_users'],
    default: 'all'
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  conversionCount: { type: Number, default: 0 },
  priority: { type: Number, default: 0 },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true
});

// Virtual for deal value
dealSchema.virtual('dealValue').get(function() {
  if (this.cashbackRate) {
    return `${this.cashbackRate}% Cashback`;
  } else if (this.cashbackAmount) {
    return `₹${this.cashbackAmount} Cashback`;
  } else if (this.discountPercentage) {
    return `${this.discountPercentage}% Off`;
  } else if (this.discountAmount) {
    return `₹${this.discountAmount} Off`;
  }
  return 'Special Offer';
});

// Virtual for validity status
dealSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && this.validFrom <= now && this.validUntil >= now;
});

// Index for search and filtering
dealSchema.index({ title: 'text', description: 'text', category: 'text' });
dealSchema.index({ merchant: 1, isActive: 1, validUntil: 1 });
dealSchema.index({ category: 1, isActive: 1, isFeatured: 1 });
dealSchema.index({ validFrom: 1, validUntil: 1, isActive: 1 });

// Pre-save middleware to validate dates
dealSchema.pre('save', function(next) {
  if (this.validFrom >= this.validUntil) {
    return next(new Error('Valid until date must be after valid from date'));
  }
  next();
});

module.exports = mongoose.model('Deal', dealSchema);