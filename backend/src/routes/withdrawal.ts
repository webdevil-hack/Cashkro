import express from 'express';
import { 
  createWithdrawal,
  getWithdrawals,
  getWithdrawal,
  processWithdrawal,
  getWithdrawalMethods
} from '../controllers/withdrawalController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/methods', getWithdrawalMethods);
router.post('/', authenticate, createWithdrawal);
router.get('/', authenticate, getWithdrawals);
router.get('/:id', authenticate, getWithdrawal);
router.put('/:id/process', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), processWithdrawal);

export default router;