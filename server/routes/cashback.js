const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Cashback = require('../models/Cashback');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cashback
// @desc    Get user's cashback
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'credited', 'cancelled', 'expired']),
  query('type').optional().isIn(['base', 'bonus', 'referral', 'signup', 'promotional'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      status,
      type
    } = req.query;

    const filter = { user: req.userId };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cashbacks = await Cashback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('transaction', 'orderId orderValue merchant')
      .populate('transaction.merchant', 'name logo')
      .lean();

    const total = await Cashback.countDocuments(filter);

    // Calculate summary
    const summary = await Cashback.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      cashbacks,
      summary,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get cashback error:', error);
    res.status(500).json({ message: 'Server error while fetching cashback' });
  }
});

// @route   GET /api/cashback/summary
// @desc    Get user's cashback summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get cashback statistics
    const stats = await Cashback.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: null,
          totalEarned: { $sum: '$amount' },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
            }
          },
          totalConfirmed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'confirmed'] }, '$amount', 0]
            }
          },
          totalCredited: {
            $sum: {
              $cond: [{ $eq: ['$status', 'credited'] }, '$amount', 0]
            }
          },
          totalExpired: {
            $sum: {
              $cond: [{ $eq: ['$status', 'expired'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalEarned: 0,
      totalPending: 0,
      totalConfirmed: 0,
      totalCredited: 0,
      totalExpired: 0
    };

    res.json({
      wallet: user.wallet,
      cashback: result
    });

  } catch (error) {
    console.error('Get cashback summary error:', error);
    res.status(500).json({ message: 'Server error while fetching cashback summary' });
  }
});

// @route   POST /api/cashback/process
// @desc    Process cashback for confirmed transactions (Admin only)
// @access  Private (Admin)
router.post('/process', adminAuth, async (req, res) => {
  try {
    // Find all confirmed transactions that haven't been processed for cashback
    const confirmedTransactions = await Transaction.find({
      status: 'confirmed',
      paymentStatus: 'completed'
    }).populate('user');

    const processedCashbacks = [];

    for (const transaction of confirmedTransactions) {
      // Check if cashback already exists for this transaction
      const existingCashback = await Cashback.findOne({
        transaction: transaction._id,
        type: 'base'
      });

      if (existingCashback) continue;

      // Create base cashback
      const baseCashback = new Cashback({
        user: transaction.user._id,
        transaction: transaction._id,
        amount: transaction.cashbackAmount,
        type: 'base',
        status: 'confirmed',
        source: 'transaction',
        description: `Cashback for order ${transaction.orderId}`,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      });

      await baseCashback.save();

      // Update user wallet
      await User.findByIdAndUpdate(transaction.user._id, {
        $inc: {
          'wallet.balance': transaction.cashbackAmount,
          'wallet.totalEarned': transaction.cashbackAmount
        }
      });

      processedCashbacks.push(baseCashback);
    }

    res.json({
      message: `Processed ${processedCashbacks.length} cashback entries`,
      processedCashbacks
    });

  } catch (error) {
    console.error('Process cashback error:', error);
    res.status(500).json({ message: 'Server error while processing cashback' });
  }
});

// @route   POST /api/cashback/withdraw
// @desc    Request cashback withdrawal
// @access  Private
router.post('/withdraw', auth, [
  body('amount').isFloat({ min: 100 }).withMessage('Minimum withdrawal amount is ₹100'),
  body('bankAccount').isObject().withMessage('Bank account details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, bankAccount } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update user wallet
    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        'wallet.balance': -amount,
        'wallet.pendingBalance': amount
      }
    });

    // TODO: Create withdrawal request record
    // TODO: Process withdrawal through payment gateway

    res.json({
      message: 'Withdrawal request submitted successfully',
      amount,
      newBalance: user.wallet.balance - amount
    });

  } catch (error) {
    console.error('Withdraw cashback error:', error);
    res.status(500).json({ message: 'Server error while processing withdrawal' });
  }
});

module.exports = router;