// path: backend/src/routes/admin.routes.ts
import { Router } from 'express';
import { Request, Response } from 'express';
import { Store } from '../models/store.model';
import { Coupon } from '../models/coupon.model';
import { User } from '../models/user.model';
import { Transaction } from '../models/transaction.model';
import { Referral } from '../models/referral.model';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { storeValidation, couponValidation, queryValidation } from '../utils/validator';
import logger from '../utils/logger';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * Get admin dashboard statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    let days = 30;
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    else if (period === '1y') days = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get statistics
    const [
      totalUsers,
      totalStores,
      totalCoupons,
      totalTransactions,
      totalClicks,
      totalReferrals,
      recentUsers,
      recentTransactions,
      storeStats,
      transactionStats
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Store.countDocuments({ createdAt: { $gte: startDate } }),
      Coupon.countDocuments({ createdAt: { $gte: startDate } }),
      Transaction.countDocuments({ createdAt: { $gte: startDate } }),
      require('../models/click.model').Click.countDocuments({ createdAt: { $gte: startDate } }),
      Referral.countDocuments({ createdAt: { $gte: startDate } }),
      User.find({ createdAt: { $gte: startDate } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt')
        .lean(),
      Transaction.find({ createdAt: { $gte: startDate } })
        .populate('userId', 'name email')
        .populate('storeId', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Store.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: null, totalClicks: { $sum: '$stats.clicks' }, totalConversions: { $sum: '$stats.conversions' } } }
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            totalCashback: { $sum: '$cashbackAmount' },
            totalCommission: { $sum: '$commissionEarned' },
            pendingAmount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] } },
            approvedAmount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] } }
          }
        }
      ])
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalStores,
        totalCoupons,
        totalTransactions,
        totalClicks,
        totalReferrals
      },
      storeStats: storeStats[0] || { totalClicks: 0, totalConversions: 0 },
      transactionStats: transactionStats[0] || {
        totalAmount: 0,
        totalCashback: 0,
        totalCommission: 0,
        pendingAmount: 0,
        approvedAmount: 0
      },
      recent: {
        users: recentUsers,
        transactions: recentTransactions
      }
    };

    res.json({
      success: true,
      data: { stats, period }
    });
  } catch (error) {
    logger.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Create store
 */
router.post('/stores', async (req: Request, res: Response) => {
  try {
    const { error, value } = storeValidation.create.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const store = new Store(value);
    await store.save();

    logger.info(`Store created by admin: ${store.name}`);

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store }
    });
  } catch (error) {
    logger.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Update store
 */
router.put('/stores/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = storeValidation.update.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const store = await Store.findByIdAndUpdate(
      id,
      { ...value, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!store) {
      res.status(404).json({
        success: false,
        message: 'Store not found'
      });
      return;
    }

    logger.info(`Store updated by admin: ${store.name}`);

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: { store }
    });
  } catch (error) {
    logger.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Create coupon
 */
router.post('/coupons', async (req: Request, res: Response) => {
  try {
    const { error, value } = couponValidation.create.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const coupon = new Coupon(value);
    await coupon.save();

    logger.info(`Coupon created by admin: ${coupon.title}`);

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { coupon }
    });
  } catch (error) {
    logger.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Update coupon
 */
router.put('/coupons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = couponValidation.update.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { ...value, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
      return;
    }

    logger.info(`Coupon updated by admin: ${coupon.title}`);

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: { coupon }
    });
  } catch (error) {
    logger.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get all users
 */
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { error, value } = queryValidation.pagination.validate(req.query);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const { page, perPage, sort } = value;
    const { search, role, isBlocked } = req.query;

    // Build filter
    const filter: any = {};
    if (role) filter.role = role;
    if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * perPage;

    // Get users
    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(perPage)
      .select('-passwordHash')
      .lean();

    // Get total count
    const total = await User.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          perPage,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Block/Unblock user
 */
router.put('/users/:id/block', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked, updatedAt: new Date() },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    logger.info(`User ${user.email} ${isBlocked ? 'blocked' : 'unblocked'} by admin`);

    res.json({
      success: true,
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: { user: { id: user._id, email: user.email, isBlocked: user.isBlocked } }
    });
  } catch (error) {
    logger.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get referral statistics
 */
router.get('/referrals', async (req: Request, res: Response) => {
  try {
    const { error, value } = queryValidation.pagination.validate(req.query);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const { page, perPage, sort } = value;
    const { status } = req.query;

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * perPage;

    // Get referrals
    const referrals = await Referral.find(filter)
      .populate('referrerId', 'name email referralCode')
      .populate('referredId', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(perPage)
      .lean();

    // Get total count
    const total = await Referral.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        referrals,
        pagination: {
          page,
          perPage,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    logger.error('Get referrals error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Approve referral
 */
router.put('/referrals/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const referral = await Referral.findById(id);
    if (!referral) {
      res.status(404).json({
        success: false,
        message: 'Referral not found'
      });
      return;
    }

    await referral.approve(adminNote);

    // Add reward to referrer's wallet
    await User.findByIdAndUpdate(
      referral.referrerId,
      { $inc: { 'wallet.available': referral.rewardAmount } }
    );

    logger.info(`Referral ${id} approved by admin`);

    res.json({
      success: true,
      message: 'Referral approved successfully',
      data: { referral: { id: referral._id, status: referral.status } }
    });
  } catch (error) {
    logger.error('Approve referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;