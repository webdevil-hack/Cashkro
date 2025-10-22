import { Router } from 'express';
import { StoreController } from '../controllers/StoreController';
import { optionalAuth } from '../middleware/auth';

const router = Router();
const storeController = new StoreController();

// Public routes
router.get('/', storeController.getAllStores.bind(storeController));
router.get('/featured', storeController.getFeaturedStores.bind(storeController));
router.get('/popular', storeController.getPopularStores.bind(storeController));
router.get('/top-cashback', storeController.getTopCashbackStores.bind(storeController));
router.get('/search', storeController.searchStores.bind(storeController));
router.get('/categories', storeController.getCategories.bind(storeController));
router.get('/category/:categorySlug', storeController.getStoresByCategory.bind(storeController));
router.get('/:slug', storeController.getStoreBySlug.bind(storeController));

// Protected route for tracking visits
router.post('/:storeId/visit', optionalAuth, storeController.visitStore.bind(storeController));

export default router;