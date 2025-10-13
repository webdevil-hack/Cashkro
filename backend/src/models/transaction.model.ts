// path: backend/src/models/transaction.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  _id: string;
  userId: string;
  clickId: string;
  storeId: string;
  orderId: string;
  amount: number;
  cashbackAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  adminNote?: string;
  affiliateNetwork: 'admitad' | 'impact' | 'cuelinks' | 'flipkart' | 'amazon' | 'custom';
  commissionRate: number;
  commissionEarned: number;
  processedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  metadata: {
    productName?: string;
    productCategory?: string;
    orderDate?: Date;
    deliveryDate?: Date;
    trackingId?: string;
    affiliateData?: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  clickId: {
    type: Schema.Types.ObjectId,
    ref: 'Click',
    required: [true, 'Click ID is required']
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store ID is required']
  },
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Order amount is required'],
    min: [0, 'Order amount cannot be negative']
  },
  cashbackAmount: {
    type: Number,
    required: [true, 'Cashback amount is required'],
    min: [0, 'Cashback amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    maxlength: [500, 'Admin note cannot exceed 500 characters']
  },
  affiliateNetwork: {
    type: String,
    enum: ['admitad', 'impact', 'cuelinks', 'flipkart', 'amazon', 'custom'],
    required: [true, 'Affiliate network is required']
  },
  commissionRate: {
    type: Number,
    required: [true, 'Commission rate is required'],
    min: [0, 'Commission rate cannot be negative'],
    max: [100, 'Commission rate cannot exceed 100%']
  },
  commissionEarned: {
    type: Number,
    required: [true, 'Commission earned is required'],
    min: [0, 'Commission earned cannot be negative']
  },
  processedAt: {
    type: Date,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  metadata: {
    productName: String,
    productCategory: String,
    orderDate: Date,
    deliveryDate: Date,
    trackingId: String,
    affiliateData: Schema.Types.Mixed
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
transactionSchema.index({ userId: 1 });
transactionSchema.index({ storeId: 1 });
transactionSchema.index({ clickId: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ affiliateNetwork: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ processedAt: -1 });
transactionSchema.index({ userId: 1, status: 1, createdAt: -1 });
transactionSchema.index({ storeId: 1, status: 1, createdAt: -1 });

// Compound index for admin queries
transactionSchema.index({ 
  status: 1, 
  createdAt: -1 
});

// Pre-save middleware to set processed date
transactionSchema.pre('save', function(this: ITransaction) {
  if (this.isModified('status')) {
    if (this.status === 'approved' && !this.approvedAt) {
      this.approvedAt = new Date();
    } else if (this.status === 'rejected' && !this.rejectedAt) {
      this.rejectedAt = new Date();
    }
    
    if (['approved', 'rejected', 'cancelled'].includes(this.status) && !this.processedAt) {
      this.processedAt = new Date();
    }
  }
});

// Method to approve transaction
transactionSchema.methods.approve = function(adminNote?: string) {
  this.status = 'approved';
  this.approvedAt = new Date();
  this.processedAt = new Date();
  if (adminNote) {
    this.adminNote = adminNote;
  }
  return this.save();
};

// Method to reject transaction
transactionSchema.methods.reject = function(reason: string, adminNote?: string) {
  this.status = 'rejected';
  this.rejectedAt = new Date();
  this.processedAt = new Date();
  this.rejectionReason = reason;
  if (adminNote) {
    this.adminNote = adminNote;
  }
  return this.save();
};

// Method to cancel transaction
transactionSchema.methods.cancel = function(reason: string, adminNote?: string) {
  this.status = 'cancelled';
  this.processedAt = new Date();
  this.rejectionReason = reason;
  if (adminNote) {
    this.adminNote = adminNote;
  }
  return this.save();
};

// Virtual for isProcessed
transactionSchema.virtual('isProcessed').get(function() {
  return ['approved', 'rejected', 'cancelled'].includes(this.status);
});

// Virtual for processingTime
transactionSchema.virtual('processingTime').get(function() {
  if (!this.processedAt) return null;
  return this.processedAt.getTime() - this.createdAt.getTime();
});

// Static method to get user's total cashback
transactionSchema.statics.getUserTotalCashback = function(userId: string, status?: string) {
  const match: any = { userId: new mongoose.Types.ObjectId(userId) };
  if (status) {
    match.status = status;
  }
  
  return this.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$cashbackAmount' } } }
  ]);
};

// Static method to get store's total commission
transactionSchema.statics.getStoreTotalCommission = function(storeId: string, status?: string) {
  const match: any = { storeId: new mongoose.Types.ObjectId(storeId) };
  if (status) {
    match.status = status;
  }
  
  return this.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$commissionEarned' } } }
  ]);
};

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);