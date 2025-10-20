const mongoose = require('mongoose');

const cashbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  orderAmount: {
    type: Number,
    required: true
  },
  cashbackAmount: {
    type: Number,
    required: true
  },
  cashbackRate: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'tracked', 'confirmed', 'cancelled', 'paid'],
    default: 'pending'
  },
  clickedAt: {
    type: Date,
    default: Date.now
  },
  trackedAt: {
    type: Date
  },
  confirmedAt: {
    type: Date
  },
  paidAt: {
    type: Date
  },
  estimatedConfirmationDate: {
    type: Date
  },
  notes: {
    type: String
  },
  affiliateNetwork: {
    type: String
  },
  networkTransactionId: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique transaction ID before saving
cashbackSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Cashback', cashbackSchema);
