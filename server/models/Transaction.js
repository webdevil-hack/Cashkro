const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: [true, 'Merchant is required']
  },
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: [true, 'Deal is required']
  },
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true
  },
  orderValue: {
    type: Number,
    required: [true, 'Order value is required'],
    min: [0, 'Order value cannot be negative']
  },
  cashbackRate: {
    type: Number,
    required: [true, 'Cashback rate is required'],
    min: [0, 'Cashback rate cannot be negative'],
    max: [100, 'Cashback rate cannot exceed 100%']
  },
  cashbackAmount: {
    type: Number,
    required: [true, 'Cashback amount is required'],
    min: [0, 'Cashback amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  trackingInfo: {
    merchantOrderId: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  verificationInfo: {
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationNotes: String
  },
  cashbackDetails: {
    baseAmount: Number,
    bonusAmount: { type: Number, default: 0 },
    referralBonus: { type: Number, default: 0 },
    totalAmount: Number,
    creditedAt: Date,
    creditedTo: {
      type: String,
      enum: ['wallet', 'bank'],
      default: 'wallet'
    }
  },
  disputeInfo: {
    isDisputed: { type: Boolean, default: false },
    disputeReason: String,
    disputeDescription: String,
    disputeStatus: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'closed'],
      default: 'open'
    },
    disputeCreatedAt: Date,
    disputeResolvedAt: Date,
    resolution: String
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  notes: String
}, {
  timestamps: true
});

// Virtual for total cashback
transactionSchema.virtual('totalCashback').get(function() {
  return this.cashbackDetails.baseAmount + 
         (this.cashbackDetails.bonusAmount || 0) + 
         (this.cashbackDetails.referralBonus || 0);
});

// Virtual for transaction age
transactionSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Index for efficient queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ merchant: 1, status: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ status: 1, paymentStatus: 1 });
transactionSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total cashback
transactionSchema.pre('save', function(next) {
  if (this.cashbackDetails) {
    this.cashbackDetails.totalAmount = this.totalCashback;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);