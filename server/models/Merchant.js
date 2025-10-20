const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Merchant name is required'],
    trim: true,
    maxlength: [100, 'Merchant name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  website: {
    type: String,
    required: [true, 'Website URL is required'],
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  logo: {
    type: String,
    required: [true, 'Logo is required']
  },
  banner: String,
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'fashion', 'electronics', 'home', 'beauty', 'health', 'food', 
      'travel', 'books', 'sports', 'automotive', 'jewelry', 'other'
    ]
  },
  subcategories: [String],
  cashbackRate: {
    type: Number,
    required: [true, 'Cashback rate is required'],
    min: [0, 'Cashback rate cannot be negative'],
    max: [100, 'Cashback rate cannot exceed 100%']
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxCashback: {
    type: Number,
    default: null
  },
  terms: {
    type: String,
    required: [true, 'Terms and conditions are required']
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String
  },
  stats: {
    totalTransactions: { type: Number, default: 0 },
    totalCashback: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true
});

// Create slug from name
merchantSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for average cashback
merchantSchema.virtual('averageCashback').get(function() {
  return this.cashbackRate;
});

// Index for search
merchantSchema.index({ name: 'text', description: 'text', category: 'text' });
merchantSchema.index({ isActive: 1, isFeatured: 1, sortOrder: 1 });
merchantSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Merchant', merchantSchema);