const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a deal title'],
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
  image: {
    type: String
  },
  dealType: {
    type: String,
    enum: ['deal', 'offer', 'sale'],
    default: 'deal'
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'bogo', 'other'],
    default: 'percentage'
  },
  discountValue: {
    type: String,
    required: true
  },
  originalPrice: {
    type: Number
  },
  salePrice: {
    type: Number
  },
  affiliateLink: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date
  },
  terms: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  categories: [{
    type: String,
    trim: true
  }],
  clickCount: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Deal', dealSchema);
