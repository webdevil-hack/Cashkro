import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  updatePassword,
  getWalletBalance,
  getTransactionHistory,
  getReferrals,
  uploadAvatar,
  deleteAccount
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.get('/wallet', getWalletBalance);
router.get('/transactions', getTransactionHistory);
router.get('/referrals', getReferrals);
router.post('/avatar', uploadAvatar);
router.delete('/account', deleteAccount);

export default router;