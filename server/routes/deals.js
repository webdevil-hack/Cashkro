const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Deal = require('../models/Deal');
const Merchant = require('../models/Merchant');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/deals
// @desc    Get all deals with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('type').optional().isIn(['cashback', 'coupon', 'offer', 'sale']),
  query('merchant').optional().isMongoId(),
  query('search').optional().isString(),
  query('featured').optional().isBoolean(),
  query('sortBy').optional().isIn(['createdAt', 'validUntil', 'cashbackRate', 'discountPercentage', 'priority']),
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
      type,
      merchant,
      search,
      featured,
      sortBy = 'priority',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (merchant) filter.merchant = merchant;
    if (featured === 'true') filter.isFeatured = true;

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    if (sortBy !== 'priority') {
      sort.priority = -1; // Secondary sort by priority
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const deals = await Deal.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('merchant', 'name logo website cashbackRate')
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
    console.error('Get deals error:', error);
    res.status(500).json({ message: 'Server error while fetching deals' });
  }
});

// @route   GET /api/deals/featured
// @desc    Get featured deals
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const deals = await Deal.find({
      isActive: true,
      isFeatured: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    })
    .sort({ priority: -1, createdAt: -1 })
    .limit(10)
    .populate('merchant', 'name logo website')
    .lean();

    res.json({ deals });
  } catch (error) {
    console.error('Get featured deals error:', error);
    res.status(500).json({ message: 'Server error while fetching featured deals' });
  }
});

// @route   GET /api/deals/popular
// @desc    Get popular deals
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const deals = await Deal.find({
      isActive: true,
      isPopular: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    })
    .sort({ clickCount: -1, conversionCount: -1 })
    .limit(10)
    .populate('merchant', 'name logo website')
    .lean();

    res.json({ deals });
  } catch (error) {
    console.error('Get popular deals error:', error);
    res.status(500).json({ message: 'Server error while fetching popular deals' });
  }
});

// @route   GET /api/deals/:id
// @desc    Get deal by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('merchant', 'name logo website cashbackRate category')
      .lean();

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (!deal.isActive || deal.validFrom > new Date() || deal.validUntil < new Date()) {
      return res.status(404).json({ message: 'Deal not available' });
    }

    // Increment click count
    await Deal.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });

    res.json({ deal });
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({ message: 'Server error while fetching deal' });
  }
});

// @route   POST /api/deals/:id/click
// @desc    Track deal click
// @access  Private
router.post('/:id/click', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Increment click count
    await Deal.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });

    res.json({ message: 'Click tracked successfully' });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ message: 'Server error while tracking click' });
  }
});

// @route   POST /api/deals
// @desc    Create a new deal (Admin only)
// @access  Private (Admin)
router.post('/', adminAuth, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('merchant').isMongoId().withMessage('Valid merchant ID is required'),
  body('type').isIn(['cashback', 'coupon', 'offer', 'sale']).withMessage('Valid deal type is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('validFrom').isISO8601().withMessage('Valid from date is required'),
  body('validUntil').isISO8601().withMessage('Valid until date is required'),
  body('terms').trim().isLength({ min: 10 }).withMessage('Terms must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate merchant exists
    const merchant = await Merchant.findById(req.body.merchant);
    if (!merchant) {
      return res.status(400).json({ message: 'Merchant not found' });
    }

    // Validate dates
    if (new Date(req.body.validFrom) >= new Date(req.body.validUntil)) {
      return res.status(400).json({ message: 'Valid until date must be after valid from date' });
    }

    const deal = new Deal(req.body);
    await deal.save();

    res.status(201).json({
      message: 'Deal created successfully',
      deal
    });

  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ message: 'Server error while creating deal' });
  }
});

// @route   PUT /api/deals/:id
// @desc    Update deal (Admin only)
// @access  Private (Admin)
router.put('/:id', adminAuth, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('type').optional().isIn(['cashback', 'coupon', 'offer', 'sale']),
  body('validFrom').optional().isISO8601(),
  body('validUntil').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json({
      message: 'Deal updated successfully',
      deal
    });

  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ message: 'Server error while updating deal' });
  }
});

// @route   DELETE /api/deals/:id
// @desc    Delete deal (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json({ message: 'Deal deactivated successfully' });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ message: 'Server error while deleting deal' });
  }
});

// @route   GET /api/deals/categories/list
// @desc    Get list of all deal categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Deal.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('Get deal categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

module.exports = router;