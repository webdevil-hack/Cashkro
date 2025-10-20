const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Transaction = require('../models/Transaction');
const Deal = require('../models/Deal');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', auth, [
  body('merchant').isMongoId().withMessage('Valid merchant ID is required'),
  body('deal').isMongoId().withMessage('Valid deal ID is required'),
  body('orderId').trim().notEmpty().withMessage('Order ID is required'),
  body('orderValue').isFloat({ min: 0 }).withMessage('Order value must be a positive number'),
  body('cashbackRate').isFloat({ min: 0, max: 100 }).withMessage('Cashback rate must be between 0 and 100'),
  body('cashbackAmount').isFloat({ min: 0 }).withMessage('Cashback amount must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { merchant, deal, orderId, orderValue, cashbackRate, cashbackAmount, trackingInfo } = req.body;

    // Verify deal exists and is valid
    const dealDoc = await Deal.findById(deal);
    if (!dealDoc || !dealDoc.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive deal' });
    }

    // Check if order ID already exists
    const existingTransaction = await Transaction.findOne({ orderId });
    if (existingTransaction) {
      return res.status(400).json({ message: 'Transaction with this order ID already exists' });
    }

    // Create transaction
    const transaction = new Transaction({
      user: req.userId,
      merchant,
      deal,
      orderId,
      orderValue,
      cashbackRate,
      cashbackAmount,
      trackingInfo,
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        referrer: req.get('Referer')
      }
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error while creating transaction' });
  }
});

// @route   GET /api/transactions
// @desc    Get user's transactions
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'rejected', 'cancelled']),
  query('sortBy').optional().isIn(['createdAt', 'orderValue', 'cashbackAmount']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
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
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { user: req.userId };
    if (status) filter.status = status;

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('merchant', 'name logo')
      .populate('deal', 'title type')
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
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get transaction by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId
    })
    .populate('merchant', 'name logo website')
    .populate('deal', 'title type terms')
    .lean();

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Server error while fetching transaction' });
  }
});

// @route   PUT /api/transactions/:id/status
// @desc    Update transaction status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'rejected', 'cancelled']).withMessage('Valid status is required'),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        notes,
        'verificationInfo.verifiedAt': new Date(),
        'verificationInfo.verifiedBy': req.userId
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      message: 'Transaction status updated successfully',
      transaction
    });

  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({ message: 'Server error while updating transaction status' });
  }
});

// @route   GET /api/transactions/admin/all
// @desc    Get all transactions (Admin only)
// @access  Private (Admin)
router.get('/admin/all', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'rejected', 'cancelled']),
  query('user').optional().isMongoId(),
  query('merchant').optional().isMongoId()
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
      user,
      merchant
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (user) filter.user = user;
    if (merchant) filter.merchant = merchant;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .populate('merchant', 'name logo')
      .populate('deal', 'title type')
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
    console.error('Get all transactions error:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
});

module.exports = router;