const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100
  },
  method: {
    type: String,
    enum: ['bank', 'upi', 'paytm', 'amazonPay'],
    required: true
  },
  paymentDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String,
    accountHolderName: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  },
  processedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique transaction ID
withdrawalSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    this.transactionId = `WD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
