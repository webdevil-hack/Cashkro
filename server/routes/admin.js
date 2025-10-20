const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Merchant = require('../models/Merchant');
const Deal = require('../models/Deal');
const Transaction = require('../models/Transaction');
const Cashback = require('../models/Cashback');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get basic counts
    const [
      totalUsers,
      totalMerchants,
      totalDeals,
      totalTransactions,
      totalCashback
    ] = await Promise.all([
      User.countDocuments(),
      Merchant.countDocuments({ isActive: true }),
      Deal.countDocuments({ isActive: true }),
      Transaction.countDocuments(),
      Cashback.countDocuments()
    ]);

    // Get revenue statistics
    const revenueStats = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalTransactionValue: { $sum: '$orderValue' },
          totalCashbackPaid: { $sum: '$cashbackAmount' },
          averageOrderValue: { $avg: '$orderValue' },
          averageCashback: { $avg: '$cashbackAmount' }
        }
      }
    ]);

    // Get recent activity
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('merchant', 'name')
      .populate('deal', 'title')
      .lean();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt')
      .lean();

    // Get monthly statistics for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          transactionCount: { $sum: 1 },
          totalValue: { $sum: '$orderValue' },
          totalCashback: { $sum: '$cashbackAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalMerchants,
        totalDeals,
        totalTransactions,
        totalCashback
      },
      revenue: revenueStats[0] || {
        totalTransactionValue: 0,
        totalCashbackPaid: 0,
        averageOrderValue: 0,
        averageCashback: 0
      },
      recentActivity: {
        transactions: recentTransactions,
        users: recentUsers
      },
      monthlyStats
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// @route   GET /api/admin/merchants
// @desc    Get all merchants for admin
// @access  Private (Admin)
router.get('/merchants', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      isActive
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const merchants = await Merchant.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Merchant.countDocuments(filter);

    res.json({
      merchants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get admin merchants error:', error);
    res.status(500).json({ message: 'Server error while fetching merchants' });
  }
});

// @route   GET /api/admin/deals
// @desc    Get all deals for admin
// @access  Private (Admin)
router.get('/deals', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      type,
      isActive
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const deals = await Deal.find(filter)
      .populate('merchant', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Deal.countDocuments(filter);

    res.json({
      deals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get admin deals error:', error);
    res.status(500).json({ message: 'Server error while fetching deals' });
  }
});

// @route   GET /api/admin/transactions
// @desc    Get all transactions for admin
// @access  Private (Admin)
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      user,
      merchant,
      dateFrom,
      dateTo
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (user) filter.user = user;
    if (merchant) filter.merchant = merchant;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(filter)
      .populate('user', 'name email')
      .populate('merchant', 'name logo')
      .populate('deal', 'title type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get admin transactions error:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin)
router.put('/users/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

// @route   PUT /api/admin/merchants/:id/status
// @desc    Update merchant status
// @access  Private (Admin)
router.put('/merchants/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  body('isFeatured').optional().isBoolean(),
  body('isPopular').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
    if (req.body.isFeatured !== undefined) updates.isFeatured = req.body.isFeatured;
    if (req.body.isPopular !== undefined) updates.isPopular = req.body.isPopular;

    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.json({
      message: 'Merchant status updated successfully',
      merchant
    });

  } catch (error) {
    console.error('Update merchant status error:', error);
    res.status(500).json({ message: 'Server error while updating merchant status' });
  }
});

module.exports = router;