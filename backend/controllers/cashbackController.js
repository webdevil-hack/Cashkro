const Cashback = require('../models/Cashback');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// @desc    Get user cashback history
// @route   GET /api/cashback/my-cashback
// @access  Private
exports.getUserCashback = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const cashback = await Cashback.find(query)
      .populate('store', 'name logo')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Cashback.countDocuments(query);

    // Get summary
    const summary = await Cashback.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$cashbackAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      count: cashback.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      cashback,
      summary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get cashback by ID
// @route   GET /api/cashback/:id
// @access  Private
exports.getCashbackById = async (req, res) => {
  try {
    const cashback = await Cashback.findById(req.params.id)
      .populate('store')
      .populate('user', 'name email');

    if (!cashback) {
      return res.status(404).json({
        success: false,
        message: 'Cashback not found'
      });
    }

    // Only allow users to view their own cashback or admins
    if (cashback.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      cashback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update cashback status (Admin only)
// @route   PUT /api/cashback/:id/status
// @access  Private/Admin
exports.updateCashbackStatus = async (req, res) => {
  try {
    const { status, orderAmount, cashbackAmount, notes } = req.body;

    const cashback = await Cashback.findById(req.params.id);

    if (!cashback) {
      return res.status(404).json({
        success: false,
        message: 'Cashback not found'
      });
    }

    const oldStatus = cashback.status;
    
    cashback.status = status;
    if (orderAmount) cashback.orderAmount = orderAmount;
    if (cashbackAmount) cashback.cashbackAmount = cashbackAmount;
    if (notes) cashback.notes = notes;

    if (status === 'tracked') {
      cashback.trackedAt = new Date();
      // Set estimated confirmation date (90 days from now)
      cashback.estimatedConfirmationDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    } else if (status === 'confirmed') {
      cashback.confirmedAt = new Date();
    } else if (status === 'paid') {
      cashback.paidAt = new Date();
    }

    await cashback.save();

    // Update user cashback totals
    const user = await User.findById(cashback.user);
    
    if (status === 'tracked' && oldStatus === 'pending') {
      user.pendingCashback += cashback.cashbackAmount;
    } else if (status === 'confirmed' && oldStatus === 'tracked') {
      user.pendingCashback -= cashback.cashbackAmount;
      user.confirmedCashback += cashback.cashbackAmount;
    } else if (status === 'cancelled') {
      if (oldStatus === 'tracked') {
        user.pendingCashback -= cashback.cashbackAmount;
      } else if (oldStatus === 'confirmed') {
        user.confirmedCashback -= cashback.cashbackAmount;
      }
    }

    user.totalCashback = user.pendingCashback + user.confirmedCashback + user.withdrawnCashback;
    await user.save();

    res.json({
      success: true,
      cashback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Request withdrawal
// @route   POST /api/cashback/withdraw
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, method, paymentDetails } = req.body;

    const user = await User.findById(req.user._id);

    // Check minimum withdrawal amount
    if (amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is ₹100'
      });
    }

    // Check if user has sufficient confirmed cashback
    if (user.confirmedCashback < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient confirmed cashback balance'
      });
    }

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount,
      method,
      paymentDetails
    });

    // Deduct from confirmed cashback
    user.confirmedCashback -= amount;
    await user.save();

    res.status(201).json({
      success: true,
      withdrawal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user withdrawals
// @route   GET /api/cashback/withdrawals
// @access  Private
exports.getWithdrawals = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };
    const skip = (page - 1) * limit;

    const withdrawals = await Withdrawal.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Withdrawal.countDocuments(query);

    res.json({
      success: true,
      count: withdrawals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      withdrawals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
