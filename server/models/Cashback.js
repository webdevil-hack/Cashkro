const mongoose = require('mongoose');

const cashbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: [true, 'Transaction is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['base', 'bonus', 'referral', 'signup', 'promotional']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'credited', 'cancelled', 'expired'],
    default: 'pending'
  },
  creditedAt: Date,
  expiresAt: Date,
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: ['transaction', 'referral', 'signup', 'promotion', 'admin']
  },
  description: String,
  metadata: {
    originalAmount: Number,
    bonusMultiplier: Number,
    referralCode: String,
    promotionId: String
  }
}, {
  timestamps: true
});

// Virtual for is expired
cashbackSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

// Virtual for days until expiry
cashbackSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiresAt) return null;
  const now = new Date();
  const diffTime = this.expiresAt - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Index for efficient queries
cashbackSchema.index({ user: 1, status: 1, createdAt: -1 });
cashbackSchema.index({ transaction: 1 });
cashbackSchema.index({ status: 1, expiresAt: 1 });
cashbackSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Cashback', cashbackSchema);