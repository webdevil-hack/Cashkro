const Store = require('../models/Store');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
exports.getStores = async (req, res) => {
  try {
    const {
      category,
      featured,
      search,
      sort = '-popularity',
      page = 1,
      limit = 20
    } = req.query;

    const query = { isActive: true };

    if (category) {
      query.categories = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const stores = await Store.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Store.countDocuments(query);

    res.json({
      success: true,
      count: stores.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      stores
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Public
exports.getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      store
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create store
// @route   POST /api/stores
// @access  Private/Admin
exports.createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);

    res.status(201).json({
      success: true,
      store
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private/Admin
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      store
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private/Admin
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      message: 'Store deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Track store click
// @route   POST /api/stores/:id/click
// @access  Private
exports.trackClick = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { clickCount: 1, popularity: 1 }
      },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Create pending cashback entry
    const Cashback = require('../models/Cashback');
    const cashback = await Cashback.create({
      user: req.user._id,
      store: store._id,
      orderAmount: 0,
      cashbackAmount: 0,
      cashbackRate: store.cashbackValue,
      status: 'pending'
    });

    res.json({
      success: true,
      affiliateLink: store.affiliateLink || store.website,
      cashbackTracking: cashback.transactionId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all categories
// @route   GET /api/stores/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Store.distinct('categories');

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
