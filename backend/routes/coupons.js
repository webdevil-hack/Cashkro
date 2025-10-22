const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  trackCouponUse
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCoupons);
router.get('/:id', getCoupon);
router.post('/:id/use', protect, trackCouponUse);

// Admin routes
router.post('/', protect, authorize('admin'), createCoupon);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

module.exports = router;
