import express from 'express';
import { 
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransactionStatus
} from '../controllers/transactionController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransaction);
router.put('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateTransactionStatus);

export default router;