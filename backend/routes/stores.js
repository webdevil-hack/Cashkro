const express = require('express');
const router = express.Router();
const {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
  trackClick,
  getCategories
} = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getStores);
router.get('/categories', getCategories);
router.get('/:id', getStore);
router.post('/:id/click', protect, trackClick);

// Admin routes
router.post('/', protect, authorize('admin'), createStore);
router.put('/:id', protect, authorize('admin'), updateStore);
router.delete('/:id', protect, authorize('admin'), deleteStore);

module.exports = router;
