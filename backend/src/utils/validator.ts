// path: backend/src/utils/validator.ts
import Joi from 'joi';

// User validation schemas
export const userValidation = {
  signup: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
    referralCode: Joi.string().alphanum().uppercase().length(8).optional().messages({
      'string.alphanum': 'Referral code must contain only alphanumeric characters',
      'string.uppercase': 'Referral code must be uppercase',
      'string.length': 'Referral code must be exactly 8 characters long'
    }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
    profilePicture: Joi.string().uri().optional().messages({
      'string.uri': 'Profile picture must be a valid URL'
    })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.max': 'New password cannot exceed 128 characters',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required'
    })
  })
};

// Store validation schemas
export const storeValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Store name must be at least 2 characters long',
      'string.max': 'Store name cannot exceed 100 characters',
      'any.required': 'Store name is required'
    }),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).optional().messages({
      'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens'
    }),
    logoUrl: Joi.string().uri().required().messages({
      'string.uri': 'Logo URL must be a valid URL',
      'any.required': 'Logo URL is required'
    }),
    bannerUrl: Joi.string().uri().optional().messages({
      'string.uri': 'Banner URL must be a valid URL'
    }),
    description: Joi.string().max(500).optional().messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
    categories: Joi.array().items(Joi.string().min(1).max(50)).min(1).required().messages({
      'array.min': 'At least one category is required',
      'any.required': 'Categories are required'
    }),
    currentCashbackPercent: Joi.number().min(0).max(100).required().messages({
      'number.min': 'Cashback percentage cannot be negative',
      'number.max': 'Cashback percentage cannot exceed 100%',
      'any.required': 'Cashback percentage is required'
    }),
    cashbackType: Joi.string().valid('percent', 'fixed').default('percent'),
    minOrderValue: Joi.number().min(0).optional().messages({
      'number.min': 'Minimum order value cannot be negative'
    }),
    maxCashback: Joi.number().min(0).optional().messages({
      'number.min': 'Maximum cashback cannot be negative'
    }),
    website: Joi.string().uri().required().messages({
      'string.uri': 'Website URL must be a valid URL',
      'any.required': 'Website URL is required'
    }),
    terms: Joi.string().min(10).required().messages({
      'string.min': 'Terms and conditions must be at least 10 characters long',
      'any.required': 'Terms and conditions are required'
    }),
    tags: Joi.array().items(Joi.string().min(1).max(30)).optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    logoUrl: Joi.string().uri().optional(),
    bannerUrl: Joi.string().uri().optional(),
    description: Joi.string().max(500).optional(),
    categories: Joi.array().items(Joi.string().min(1).max(50)).optional(),
    currentCashbackPercent: Joi.number().min(0).max(100).optional(),
    cashbackType: Joi.string().valid('percent', 'fixed').optional(),
    minOrderValue: Joi.number().min(0).optional(),
    maxCashback: Joi.number().min(0).optional(),
    website: Joi.string().uri().optional(),
    terms: Joi.string().min(10).optional(),
    active: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string().min(1).max(30)).optional()
  })
};

// Coupon validation schemas
export const couponValidation = {
  create: Joi.object({
    storeId: Joi.string().hex().length(24).required().messages({
      'string.hex': 'Store ID must be a valid MongoDB ObjectId',
      'string.length': 'Store ID must be exactly 24 characters long',
      'any.required': 'Store ID is required'
    }),
    title: Joi.string().min(5).max(100).required().messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    code: Joi.string().min(3).max(50).required().messages({
      'string.min': 'Code must be at least 3 characters long',
      'string.max': 'Code cannot exceed 50 characters',
      'any.required': 'Code is required'
    }),
    description: Joi.string().min(10).max(500).required().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Description is required'
    }),
    discountType: Joi.string().valid('percentage', 'fixed', 'free_shipping', 'buy_x_get_y').required().messages({
      'any.only': 'Discount type must be one of: percentage, fixed, free_shipping, buy_x_get_y',
      'any.required': 'Discount type is required'
    }),
    discountValue: Joi.number().min(0).required().messages({
      'number.min': 'Discount value cannot be negative',
      'any.required': 'Discount value is required'
    }),
    minOrderValue: Joi.number().min(0).optional(),
    maxDiscount: Joi.number().min(0).optional(),
    expiryDate: Joi.date().greater('now').required().messages({
      'date.greater': 'Expiry date must be in the future',
      'any.required': 'Expiry date is required'
    }),
    isExclusive: Joi.boolean().default(false),
    maxUsage: Joi.number().min(1).optional(),
    category: Joi.string().min(1).max(50).required().messages({
      'string.min': 'Category must be at least 1 character long',
      'string.max': 'Category cannot exceed 50 characters',
      'any.required': 'Category is required'
    }),
    terms: Joi.string().min(10).required().messages({
      'string.min': 'Terms must be at least 10 characters long',
      'any.required': 'Terms are required'
    }),
    imageUrl: Joi.string().uri().optional(),
    priority: Joi.number().min(0).default(0)
  }),

  update: Joi.object({
    title: Joi.string().min(5).max(100).optional(),
    code: Joi.string().min(3).max(50).optional(),
    description: Joi.string().min(10).max(500).optional(),
    discountType: Joi.string().valid('percentage', 'fixed', 'free_shipping', 'buy_x_get_y').optional(),
    discountValue: Joi.number().min(0).optional(),
    minOrderValue: Joi.number().min(0).optional(),
    maxDiscount: Joi.number().min(0).optional(),
    expiryDate: Joi.date().greater('now').optional(),
    isExclusive: Joi.boolean().optional(),
    maxUsage: Joi.number().min(1).optional(),
    category: Joi.string().min(1).max(50).optional(),
    terms: Joi.string().min(10).optional(),
    imageUrl: Joi.string().uri().optional(),
    priority: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional()
  })
};

// Click validation schemas
export const clickValidation = {
  create: Joi.object({
    storeId: Joi.string().hex().length(24).required().messages({
      'string.hex': 'Store ID must be a valid MongoDB ObjectId',
      'string.length': 'Store ID must be exactly 24 characters long',
      'any.required': 'Store ID is required'
    }),
    couponId: Joi.string().hex().length(24).optional().messages({
      'string.hex': 'Coupon ID must be a valid MongoDB ObjectId',
      'string.length': 'Coupon ID must be exactly 24 characters long'
    }),
    redirectToAffiliateUrl: Joi.string().uri().required().messages({
      'string.uri': 'Redirect URL must be a valid URL',
      'any.required': 'Redirect URL is required'
    })
  })
};

// Transaction validation schemas
export const transactionValidation = {
  update: Joi.object({
    status: Joi.string().valid('pending', 'approved', 'rejected', 'cancelled').required().messages({
      'any.only': 'Status must be one of: pending, approved, rejected, cancelled',
      'any.required': 'Status is required'
    }),
    adminNote: Joi.string().max(500).optional().messages({
      'string.max': 'Admin note cannot exceed 500 characters'
    }),
    rejectionReason: Joi.string().max(500).optional().messages({
      'string.max': 'Rejection reason cannot exceed 500 characters'
    })
  })
};

// Referral validation schemas
export const referralValidation = {
  create: Joi.object({
    referredId: Joi.string().hex().length(24).required().messages({
      'string.hex': 'Referred user ID must be a valid MongoDB ObjectId',
      'string.length': 'Referred user ID must be exactly 24 characters long',
      'any.required': 'Referred user ID is required'
    }),
    rewardAmount: Joi.number().min(0).required().messages({
      'number.min': 'Reward amount cannot be negative',
      'any.required': 'Reward amount is required'
    }),
    rewardType: Joi.string().valid('signup', 'first_purchase', 'milestone').required().messages({
      'any.only': 'Reward type must be one of: signup, first_purchase, milestone',
      'any.required': 'Reward type is required'
    }),
    milestone: Joi.number().min(1).optional()
  }),

  update: Joi.object({
    status: Joi.string().valid('pending', 'approved', 'rejected', 'cancelled').required(),
    adminNote: Joi.string().max(500).optional(),
    rejectionReason: Joi.string().max(500).optional()
  })
};

// Query validation schemas
export const queryValidation = {
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    perPage: Joi.number().min(1).max(100).default(20),
    sort: Joi.string().valid('createdAt', '-createdAt', 'name', '-name', 'currentCashbackPercent', '-currentCashbackPercent').default('-createdAt')
  }),

  storeQuery: Joi.object({
    category: Joi.string().optional(),
    search: Joi.string().min(1).max(100).optional(),
    active: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    minCashback: Joi.number().min(0).optional(),
    maxCashback: Joi.number().min(0).optional(),
    tags: Joi.string().optional()
  }),

  couponQuery: Joi.object({
    store: Joi.string().hex().length(24).optional(),
    category: Joi.string().optional(),
    isExclusive: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
  })
};

// OTP validation
export const otpValidation = {
  send: Joi.object({
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone number is required'
    })
  }),

  verify: Joi.object({
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone number is required'
    }),
    otp: Joi.string().length(6).pattern(/^\d{6}$/).required().messages({
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only digits',
      'any.required': 'OTP is required'
    })
  })
};

// Wallet validation
export const walletValidation = {
  withdraw: Joi.object({
    amount: Joi.number().min(100).max(50000).required().messages({
      'number.min': 'Minimum withdrawal amount is ₹100',
      'number.max': 'Maximum withdrawal amount is ₹50,000',
      'any.required': 'Withdrawal amount is required'
    }),
    bankDetails: Joi.object({
      accountNumber: Joi.string().pattern(/^\d{9,18}$/).required().messages({
        'string.pattern.base': 'Account number must be 9-18 digits'
      }),
      ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).required().messages({
        'string.pattern.base': 'IFSC code must be valid'
      }),
      accountHolderName: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Account holder name must be at least 2 characters',
        'string.max': 'Account holder name cannot exceed 100 characters'
      })
    }).required()
  })
};

export default {
  userValidation,
  storeValidation,
  couponValidation,
  clickValidation,
  transactionValidation,
  referralValidation,
  queryValidation,
  otpValidation,
  walletValidation
};