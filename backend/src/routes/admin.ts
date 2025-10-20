import express from 'express';
import { 
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  createStore,
  updateStore,
  deleteStore,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  createDeal,
  updateDeal,
  deleteDeal,
  getTransactions,
  getCashbacks,
  getWithdrawals
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);

// Stores
router.post('/stores', createStore);
router.put('/stores/:id', updateStore);
router.delete('/stores/:id', deleteStore);

// Coupons
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Deals
router.post('/deals', createDeal);
router.put('/deals/:id', updateDeal);
router.delete('/deals/:id', deleteDeal);

// Transactions
router.get('/transactions', getTransactions);

// Cashbacks
router.get('/cashbacks', getCashbacks);

// Withdrawals
router.get('/withdrawals', getWithdrawals);

export default router;