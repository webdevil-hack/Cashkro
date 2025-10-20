const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/withdraw
// @desc    Process cashback withdrawal
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

    // Validate bank account details
    if (!user.bankDetails.isVerified) {
      return res.status(400).json({ message: 'Bank account not verified' });
    }

    // Update user wallet
    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        'wallet.balance': -amount,
        'wallet.pendingBalance': amount
      }
    });

    // TODO: Integrate with payment gateway (Razorpay, PayU, etc.)
    // For now, simulate successful withdrawal
    setTimeout(async () => {
      await User.findByIdAndUpdate(req.userId, {
        $inc: {
          'wallet.pendingBalance': -amount,
          'wallet.totalWithdrawn': amount
        }
      });
    }, 5000); // Simulate 5 second processing time

    res.json({
      message: 'Withdrawal request submitted successfully',
      amount,
      newBalance: user.wallet.balance - amount,
      estimatedProcessingTime: '2-3 business days'
    });

  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ message: 'Server error while processing withdrawal' });
  }
});

// @route   GET /api/payments/withdrawal-history
// @desc    Get withdrawal history
// @access  Private
router.get('/withdrawal-history', auth, async (req, res) => {
  try {
    // TODO: Implement withdrawal history tracking
    res.json({
      message: 'Withdrawal history feature coming soon',
      withdrawals: []
    });
  } catch (error) {
    console.error('Get withdrawal history error:', error);
    res.status(500).json({ message: 'Server error while fetching withdrawal history' });
  }
});

module.exports = router;