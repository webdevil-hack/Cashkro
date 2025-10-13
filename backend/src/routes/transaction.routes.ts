// path: backend/src/routes/transaction.routes.ts
import { Router } from 'express';
import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { queryValidation, transactionValidation } from '../utils/validator';
import logger from '../utils/logger';

const router = Router();

/**
 * Get user's transaction history
 */
router.get('/user/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requestingUserId = (req as any).user.userId;

    // Check if user is requesting their own transactions or is admin
    if (userId !== requestingUserId && (req as any).user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    // Validate query parameters
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
    const { status, storeId, startDate, endDate } = req.query;

    // Build filter
    const filter: any = { userId };
    if (status) filter.status = status;
    if (storeId) filter.storeId = storeId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    // Calculate pagination
    const skip = (page - 1) * perPage;

    // Get transactions
    const transactions = await Transaction.find(filter)
      .populate('storeId', 'name slug logoUrl')
      .populate('clickId', 'clickToken createdAt')
      .sort(sort)
      .skip(skip)
      .limit(perPage)
      .lean();

    // Get total count
    const total = await Transaction.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        transactions,
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
    logger.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get transaction by ID
 */
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const transaction = await Transaction.findById(id)
      .populate('storeId', 'name slug logoUrl')
      .populate('clickId', 'clickToken createdAt')
      .populate('userId', 'name email')
      .lean();

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
      return;
    }

    // Check if user owns this transaction or is admin
    if (transaction.userId.toString() !== userId && (req as any).user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        transaction
      }
    });
  } catch (error) {
    logger.error('Get transaction by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Update transaction status (Admin only)
 */
router.put('/:id/status', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = transactionValidation.update.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
      return;
    }

    const { status, adminNote, rejectionReason } = value;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
      return;
    }

    // Update transaction based on status
    if (status === 'approved') {
      await transaction.approve(adminNote);
      
      // Move cashback from pending to available
      await User.findByIdAndUpdate(
        transaction.userId,
        {
          $inc: {
            'wallet.pending': -transaction.cashbackAmount,
            'wallet.available': transaction.cashbackAmount
          }
        }
      );
    } else if (status === 'rejected') {
      await transaction.reject(rejectionReason || 'No reason provided', adminNote);
    } else if (status === 'cancelled') {
      await transaction.cancel(rejectionReason || 'Cancelled by admin', adminNote);
    } else {
      transaction.status = status;
      if (adminNote) transaction.adminNote = adminNote;
      await transaction.save();
    }

    logger.info(`Transaction ${id} status updated to ${status} by admin`);

    res.json({
      success: true,
      message: 'Transaction status updated successfully',
      data: {
        transaction: {
          id: transaction._id,
          status: transaction.status,
          adminNote: transaction.adminNote,
          updatedAt: transaction.updatedAt
        }
      }
    });
  } catch (error) {
    logger.error('Update transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get transaction statistics
 */
router.get('/stats/summary', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { period = '30d' } = req.query;

    // Calculate date range
    let days = 30;
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    else if (period === '1y') days = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get transaction stats
    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: transaction.userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalCashback: { $sum: '$cashbackAmount' },
          pendingTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approvedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejectedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          pendingCashback: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$cashbackAmount', 0] }
          },
          approvedCashback: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$cashbackAmount', 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalTransactions: 0,
      totalAmount: 0,
      totalCashback: 0,
      pendingTransactions: 0,
      approvedTransactions: 0,
      rejectedTransactions: 0,
      pendingCashback: 0,
      approvedCashback: 0
    };

    res.json({
      success: true,
      data: {
        stats: result,
        period
      }
    });
  } catch (error) {
    logger.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get all transactions (Admin only)
 */
router.get('/', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    // Validate query parameters
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
    const { status, userId, storeId, startDate, endDate } = req.query;

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (storeId) filter.storeId = storeId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    // Calculate pagination
    const skip = (page - 1) * perPage;

    // Get transactions
    const transactions = await Transaction.find(filter)
      .populate('userId', 'name email')
      .populate('storeId', 'name slug logoUrl')
      .populate('clickId', 'clickToken createdAt')
      .sort(sort)
      .skip(skip)
      .limit(perPage)
      .lean();

    // Get total count
    const total = await Transaction.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        transactions,
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
    logger.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;