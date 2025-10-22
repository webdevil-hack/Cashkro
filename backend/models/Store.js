const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a store name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  logo: {
    type: String,
    required: [true, 'Please provide a logo URL']
  },
  banner: {
    type: String
  },
  website: {
    type: String,
    required: [true, 'Please provide a website URL']
  },
  affiliateLink: {
    type: String
  },
  categories: [{
    type: String,
    trim: true
  }],
  cashbackType: {
    type: String,
    enum: ['percentage', 'fixed', 'upto'],
    default: 'percentage'
  },
  cashbackValue: {
    type: Number,
    required: [true, 'Please provide cashback value']
  },
  maxCashback: {
    type: Number
  },
  cashbackTerms: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 0
  },
  clickCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from name before saving
storeSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Store', storeSchema);
