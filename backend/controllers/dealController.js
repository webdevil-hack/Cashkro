const Deal = require('../models/Deal');

// @desc    Get all deals
// @route   GET /api/deals
// @access  Public
exports.getDeals = async (req, res) => {
  try {
    const {
      category,
      store,
      featured,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    const query = { isActive: true };

    if (category) {
      query.categories = category;
    }

    if (store) {
      query.store = store;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter out expired deals
    query.$or = [
      { expiryDate: { $exists: false } },
      { expiryDate: null },
      { expiryDate: { $gte: new Date() } }
    ];

    const skip = (page - 1) * limit;

    const deals = await Deal.find(query)
      .populate('store', 'name logo slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Deal.countDocuments(query);

    res.json({
      success: true,
      count: deals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      deals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Public
exports.getDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate('store');

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    res.json({
      success: true,
      deal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create deal
// @route   POST /api/deals
// @access  Private/Admin
exports.createDeal = async (req, res) => {
  try {
    const deal = await Deal.create(req.body);

    res.status(201).json({
      success: true,
      deal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private/Admin
exports.updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    res.json({
      success: true,
      deal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private/Admin
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    res.json({
      success: true,
      message: 'Deal deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Track deal click
// @route   POST /api/deals/:id/click
// @access  Private
exports.trackClick = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { clickCount: 1, popularity: 1 }
      },
      { new: true }
    ).populate('store');

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    res.json({
      success: true,
      affiliateLink: deal.affiliateLink
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
