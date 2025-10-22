import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard stats
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        totalUsers: 0,
        totalStores: 0,
        totalCashbackPaid: 0,
        pendingWithdrawals: 0,
      },
    },
  });
});

// Manage stores
router.get('/stores', (req, res) => {
  res.json({
    success: true,
    data: {
      stores: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    },
  });
});

// Manage users
router.get('/users', (req, res) => {
  res.json({
    success: true,
    data: {
      users: [],
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