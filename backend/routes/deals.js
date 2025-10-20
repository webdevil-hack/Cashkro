const express = require('express');
const router = express.Router();
const {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  trackClick
} = require('../controllers/dealController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDeals);
router.get('/:id', getDeal);
router.post('/:id/click', protect, trackClick);

// Admin routes
router.post('/', protect, authorize('admin'), createDeal);
router.put('/:id', protect, authorize('admin'), updateDeal);
router.delete('/:id', protect, authorize('admin'), deleteDeal);

module.exports = router;
