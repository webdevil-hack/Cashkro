// path: backend/src/routes/store.routes.ts
import { Router } from 'express';
import storeController from '../controllers/store.controller';

const router = Router();

// Public routes
router.get('/', storeController.getStores);
router.get('/search', storeController.searchStores);
router.get('/featured', storeController.getFeaturedStores);
router.get('/trending', storeController.getTrendingStores);
router.get('/categories', storeController.getStoreCategories);
router.get('/:slug', storeController.getStoreBySlug);
router.get('/:slug/stats', storeController.getStoreStats);
router.get('/:slug/coupons', storeController.getStoreCoupons);

export default router;