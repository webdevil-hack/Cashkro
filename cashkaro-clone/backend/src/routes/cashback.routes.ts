import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All cashback routes require authentication
router.use(authenticate);

// Get user cashback summary
router.get('/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      pending: 0,
      confirmed: 0,
      available: 0,
      totalEarnings: 0,
      transactions: {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
      },
    },
  });
});

// Get cashback transactions
router.get('/transactions', (req, res) => {
  res.json({
    success: true,
    data: {
      cashbacks: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    },
  });
});

export default router;