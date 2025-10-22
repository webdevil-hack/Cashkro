import express from 'express';
import { 
  getCoupons, 
  getCoupon,
  validateCoupon,
  getStoreCoupons,
  searchCoupons
} from '../controllers/couponController';

const router = express.Router();

router.get('/', getCoupons);
router.get('/search', searchCoupons);
router.get('/store/:storeId', getStoreCoupons);
router.get('/:id', getCoupon);
router.post('/:id/validate', validateCoupon);

export default router;