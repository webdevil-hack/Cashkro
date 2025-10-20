const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a coupon title'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'freeShipping', 'other'],
    default: 'percentage'
  },
  discountValue: {
    type: String,
    required: true
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  expiryDate: {
    type: Date
  },
  terms: {
    type: String
  },
  isExclusive: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  categories: [{
    type: String,
    trim: true
  }],
  usageCount: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 100
  },
  clickCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
