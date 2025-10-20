import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      user: (req as any).user,
    },
  });
});

// Update user profile
router.put('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Profile updated successfully',
  });
});

// Get withdrawal history
router.get('/withdrawals', (req, res) => {
  res.json({
    success: true,
    data: {
      withdrawals: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    },
  });
});

// Create withdrawal request
router.post('/withdraw', (req, res) => {
  res.json({
    success: true,
    message: 'Withdrawal request created',
  });
});

export default router;