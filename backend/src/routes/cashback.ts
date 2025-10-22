import express from 'express';
import { 
  getCashbacks,
  getCashback,
  confirmCashback,
  getPendingCashbacks
} from '../controllers/cashbackController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getCashbacks);
router.get('/pending', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getPendingCashbacks);
router.get('/:id', authenticate, getCashback);
router.put('/:id/confirm', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), confirmCashback);

export default router;