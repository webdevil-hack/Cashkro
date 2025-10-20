const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Cashback = require('../models/Cashback');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.getPublicProfile() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().matches(/^[6-9]\d{9}$/),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['name', 'phone', 'dateOfBirth', 'gender', 'address', 'preferences'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   PUT /api/users/bank-details
// @desc    Update bank details
// @access  Private
router.put('/bank-details', auth, [
  body('accountNumber').isLength({ min: 9, max: 18 }).withMessage('Account number must be between 9 and 18 digits'),
  body('ifscCode').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format'),
  body('bankName').trim().isLength({ min: 2, max: 100 }).withMessage('Bank name is required'),
  body('accountHolderName').trim().isLength({ min: 2, max: 100 }).withMessage('Account holder name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber, ifscCode, bankName, accountHolderName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        'bankDetails.accountNumber': accountNumber,
        'bankDetails.ifscCode': ifscCode,
        'bankDetails.bankName': bankName,
        'bankDetails.accountHolderName': accountHolderName,
        'bankDetails.isVerified': false
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Bank details updated successfully',
      bankDetails: user.bankDetails
    });

  } catch (error) {
    console.error('Update bank details error:', error);
    res.status(500).json({ message: 'Server error while updating bank details' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get recent transactions
    const recentTransactions = await Transaction.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('merchant', 'name logo')
      .populate('deal', 'title type')
      .lean();

    // Get recent cashback
    const recentCashback = await Cashback.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('transaction', 'orderId merchant')
      .populate('transaction.merchant', 'name logo')
      .lean();

    // Get statistics
    const stats = await Transaction.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$orderValue' },
          totalCashback: { $sum: '$cashbackAmount' },
          pendingCashback: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$cashbackAmount', 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      totalCashback: 0,
      pendingCashback: 0
    };

    res.json({
      user: user.getPublicProfile(),
      recentTransactions,
      recentCashback,
      stats: result
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// @route   GET /api/users/referrals
// @desc    Get user's referrals
// @access  Private
router.get('/referrals', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get referred users
    const referrals = await User.find({ referredBy: req.userId })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Get referral earnings
    const referralEarnings = await Cashback.aggregate([
      { $match: { user: req.userId, type: 'referral' } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' },
          totalReferrals: { $sum: 1 }
        }
      }
    ]);

    const earnings = referralEarnings[0] || {
      totalEarnings: 0,
      totalReferrals: 0
    };

    res.json({
      referralCode: user.referralCode,
      referrals,
      earnings
    });

  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ message: 'Server error while fetching referrals' });
  }
});

// @route   GET /api/users/admin/all
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password -bankDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

module.exports = router;