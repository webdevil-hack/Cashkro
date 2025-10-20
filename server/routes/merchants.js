const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Merchant = require('../models/Merchant');
const Deal = require('../models/Deal');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/merchants
// @desc    Get all merchants with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['name', 'cashbackRate', 'createdAt', 'popularity']),
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
      category,
      search,
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'popularity') {
      sort['stats.totalUsers'] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const merchants = await Merchant.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('category', 'name')
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
    console.error('Get merchants error:', error);
    res.status(500).json({ message: 'Server error while fetching merchants' });
  }
});

// @route   GET /api/merchants/:id
// @desc    Get merchant by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    if (!merchant.isActive) {
      return res.status(404).json({ message: 'Merchant not available' });
    }

    // Get active deals for this merchant
    const deals = await Deal.find({
      merchant: merchant._id,
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    }).sort({ priority: -1, createdAt: -1 }).limit(10);

    res.json({
      merchant,
      deals
    });

  } catch (error) {
    console.error('Get merchant error:', error);
    res.status(500).json({ message: 'Server error while fetching merchant' });
  }
});

// @route   GET /api/merchants/:id/deals
// @desc    Get deals for a specific merchant
// @access  Public
router.get('/:id/deals', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('type').optional().isIn(['cashback', 'coupon', 'offer', 'sale']),
  query('sortBy').optional().isIn(['createdAt', 'validUntil', 'cashbackRate', 'discountPercentage'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      type,
      sortBy = 'createdAt'
    } = req.query;

    const filter = {
      merchant: req.params.id,
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    };

    if (type) {
      filter.type = type;
    }

    const sort = { [sortBy]: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const deals = await Deal.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('merchant', 'name logo website')
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
    console.error('Get merchant deals error:', error);
    res.status(500).json({ message: 'Server error while fetching merchant deals' });
  }
});

// @route   POST /api/merchants
// @desc    Create a new merchant (Admin only)
// @access  Private (Admin)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('website').isURL().withMessage('Please provide a valid website URL'),
  body('logo').notEmpty().withMessage('Logo is required'),
  body('category').isIn([
    'fashion', 'electronics', 'home', 'beauty', 'health', 'food', 
    'travel', 'books', 'sports', 'automotive', 'jewelry', 'other'
  ]).withMessage('Please provide a valid category'),
  body('cashbackRate').isFloat({ min: 0, max: 100 }).withMessage('Cashback rate must be between 0 and 100'),
  body('terms').trim().isLength({ min: 10 }).withMessage('Terms must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const merchant = new Merchant(req.body);
    await merchant.save();

    res.status(201).json({
      message: 'Merchant created successfully',
      merchant
    });

  } catch (error) {
    console.error('Create merchant error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Merchant with this name or slug already exists' });
    }
    res.status(500).json({ message: 'Server error while creating merchant' });
  }
});

// @route   PUT /api/merchants/:id
// @desc    Update merchant (Admin only)
// @access  Private (Admin)
router.put('/:id', adminAuth, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 500 }),
  body('website').optional().isURL(),
  body('category').optional().isIn([
    'fashion', 'electronics', 'home', 'beauty', 'health', 'food', 
    'travel', 'books', 'sports', 'automotive', 'jewelry', 'other'
  ]),
  body('cashbackRate').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.json({
      message: 'Merchant updated successfully',
      merchant
    });

  } catch (error) {
    console.error('Update merchant error:', error);
    res.status(500).json({ message: 'Server error while updating merchant' });
  }
});

// @route   DELETE /api/merchants/:id
// @desc    Delete merchant (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.json({ message: 'Merchant deactivated successfully' });

  } catch (error) {
    console.error('Delete merchant error:', error);
    res.status(500).json({ message: 'Server error while deleting merchant' });
  }
});

// @route   GET /api/merchants/categories/list
// @desc    Get list of all categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Merchant.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

module.exports = router;