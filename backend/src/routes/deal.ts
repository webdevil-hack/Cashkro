import express from 'express';
import { 
  getDeals, 
  getDeal,
  getFeaturedDeals,
  getStoreDeals,
  searchDeals
} from '../controllers/dealController';

const router = express.Router();

router.get('/', getDeals);
router.get('/featured', getFeaturedDeals);
router.get('/search', searchDeals);
router.get('/store/:storeId', getStoreDeals);
router.get('/:id', getDeal);

export default router;