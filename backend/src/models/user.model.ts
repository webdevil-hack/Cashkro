// path: backend/src/models/user.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  wallet: {
    available: number;
    pending: number;
  };
  referralCode: string;
  referredBy?: string;
  oauthProviders: Array<{
    provider: 'google' | 'facebook';
    providerId: string;
  }>;
  isBlocked: boolean;
  phone?: string;
  isPhoneVerified: boolean;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: function(this: IUser) {
      return !this.oauthProviders || this.oauthProviders.length === 0;
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  wallet: {
    available: {
      type: Number,
      default: 0,
      min: [0, 'Available balance cannot be negative']
    },
    pending: {
      type: Number,
      default: 0,
      min: [0, 'Pending balance cannot be negative']
    }
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    match: [/^[A-Z0-9]{6,12}$/, 'Referral code must be 6-12 alphanumeric characters']
  },
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  oauthProviders: [{
    provider: {
      type: String,
      enum: ['google', 'facebook']
    },
    providerId: String
  }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    match: [/^https?:\/\/.+/, 'Profile picture must be a valid URL']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ referralCode: 1 }, { unique: true, sparse: true });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'oauthProviders.providerId': 1 });

// Generate referral code before saving
userSchema.pre('save', async function(this: IUser) {
  if (!this.referralCode) {
    let referralCode: string;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate a random 8-character code
      referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Check if it's unique
      const existingUser = await mongoose.model('User').findOne({ referralCode });
      if (!existingUser) {
        isUnique = true;
      }
    }
    
    this.referralCode = referralCode!;
  }
});

// Virtual for total wallet balance
userSchema.virtual('totalBalance').get(function() {
  return this.wallet.available + this.wallet.pending;
});

export const User = mongoose.model<IUser>('User', userSchema);