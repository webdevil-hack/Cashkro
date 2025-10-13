// path: backend/src/models/referral.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  _id: string;
  referrerId: string;
  referredId: string;
  rewardAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  rewardType: 'signup' | 'first_purchase' | 'milestone';
  milestone?: number;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>({
  referrerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Referrer ID is required']
  },
  referredId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Referred user ID is required']
  },
  rewardAmount: {
    type: Number,
    required: [true, 'Reward amount is required'],
    min: [0, 'Reward amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  rewardType: {
    type: String,
    enum: ['signup', 'first_purchase', 'milestone'],
    required: [true, 'Reward type is required']
  },
  milestone: {
    type: Number,
    min: [1, 'Milestone must be at least 1']
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
  adminNote: {
    type: String,
    maxlength: [500, 'Admin note cannot exceed 500 characters']
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
referralSchema.index({ referrerId: 1 });
referralSchema.index({ referredId: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ rewardType: 1 });
referralSchema.index({ createdAt: -1 });
referralSchema.index({ referrerId: 1, status: 1 });
referralSchema.index({ referredId: 1, status: 1 });

// Compound index for referral stats
referralSchema.index({ 
  referrerId: 1, 
  status: 1, 
  createdAt: -1 
});

// Pre-save middleware to set approval/rejection dates
referralSchema.pre('save', function(this: IReferral) {
  if (this.isModified('status')) {
    if (this.status === 'approved' && !this.approvedAt) {
      this.approvedAt = new Date();
    } else if (this.status === 'rejected' && !this.rejectedAt) {
      this.rejectedAt = new Date();
    }
  }
});

// Method to approve referral
referralSchema.methods.approve = function(adminNote?: string) {
  this.status = 'approved';
  this.approvedAt = new Date();
  if (adminNote) {
    this.adminNote = adminNote;
  }
  return this.save();
};

// Method to reject referral
referralSchema.methods.reject = function(reason: string, adminNote?: string) {
  this.status = 'rejected';
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  if (adminNote) {
    this.adminNote = adminNote;
  }
  return this.save();
};

// Method to cancel referral
referralSchema.methods.cancel = function(reason: string, adminNote?: string) {
  this.status = 'cancelled';
  this.rejectionReason = reason;
  if (adminNote) {
    this.adminNote = adminNote;
  }
  return this.save();
};

// Virtual for isProcessed
referralSchema.virtual('isProcessed').get(function() {
  return ['approved', 'rejected', 'cancelled'].includes(this.status);
});

// Virtual for processingTime
referralSchema.virtual('processingTime').get(function() {
  if (!this.approvedAt && !this.rejectedAt) return null;
  const processedAt = this.approvedAt || this.rejectedAt;
  return processedAt!.getTime() - this.createdAt.getTime();
});

// Static method to get referrer's total rewards
referralSchema.statics.getReferrerTotalRewards = function(referrerId: string, status?: string) {
  const match: any = { referrerId: new mongoose.Types.ObjectId(referrerId) };
  if (status) {
    match.status = status;
  }
  
  return this.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$rewardAmount' } } }
  ]);
};

// Static method to get referrer's referral count
referralSchema.statics.getReferrerReferralCount = function(referrerId: string, status?: string) {
  const match: any = { referrerId: new mongoose.Types.ObjectId(referrerId) };
  if (status) {
    match.status = status;
  }
  
  return this.countDocuments(match);
};

// Static method to get referrer's stats
referralSchema.statics.getReferrerStats = function(referrerId: string) {
  return this.aggregate([
    { $match: { referrerId: new mongoose.Types.ObjectId(referrerId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRewards: { $sum: '$rewardAmount' }
      }
    }
  ]);
};

// Static method to check if user was referred by someone
referralSchema.statics.getReferrerByReferredId = function(referredId: string) {
  return this.findOne({ 
    referredId: new mongoose.Types.ObjectId(referredId),
    status: 'approved'
  }).populate('referrerId', 'name email referralCode');
};

export const Referral = mongoose.model<IReferral>('Referral', referralSchema);