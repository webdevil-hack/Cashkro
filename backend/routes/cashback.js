const express = require('express');
const router = express.Router();
const {
  getUserCashback,
  getCashbackById,
  updateCashbackStatus,
  requestWithdrawal,
  getWithdrawals
} = require('../controllers/cashbackController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my-cashback', protect, getUserCashback);
router.get('/withdrawals', protect, getWithdrawals);
router.post('/withdraw', protect, requestWithdrawal);
router.get('/:id', protect, getCashbackById);

// Admin routes
router.put('/:id/status', protect, authorize('admin'), updateCashbackStatus);

module.exports = router;
