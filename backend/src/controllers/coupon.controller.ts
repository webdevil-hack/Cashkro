// path: backend/src/controllers/coupon.controller.ts
import { Request, Response } from 'express';
import { Coupon } from '../models/coupon.model';
import { queryValidation, couponValidation } from '../utils/validator';
import logger from '../utils/logger';

export class CouponController {
  /**
   * Get all coupons with pagination and filters
   */
  async getCoupons(req: Request, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const { error: queryError, value: queryValue } = queryValidation.pagination.validate(req.query);
      if (queryError) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: queryError.details.map(detail => detail.message)
        });
        return;
      }

      const { error: filterError, value: filterValue } = queryValidation.couponQuery.validate(req.query);
      if (filterError) {
        res.status(400).json({
          success: false,
          message: 'Invalid filter parameters',
          errors: filterError.details.map(detail => detail.message)
        });
        return;
      }

      const { page, perPage, sort } = queryValue;
      const { store, category, isExclusive, isActive } = filterValue;

      // Build filter object
      const filter: any = {};
      if (store) filter.storeId = store;
      if (category) filter.category = category;
      if (isExclusive !== undefined) filter.isExclusive = isExclusive;
      if (isActive !== undefined) filter.isActive = isActive;

      // Always filter out expired coupons for public API
      if (isActive !== false) {
        filter.expiryDate = { $gt: new Date() };
      }

      // Calculate pagination
      const skip = (page - 1) * perPage;

      // Get coupons with pagination
      const coupons = await Coupon.find(filter)
        .populate('storeId', 'name slug logoUrl currentCashbackPercent')
        .sort(sort)
        .skip(skip)
        .limit(perPage)
        .lean();

      // Get total count
      const total = await Coupon.countDocuments(filter);

      // Calculate pagination info
      const totalPages = Math.ceil(total / perPage);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: {
          coupons,
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
      logger.error('Get coupons error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get coupon by ID
   */
  async getCouponById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const coupon = await Coupon.findById(id)
        .populate('storeId', 'name slug logoUrl currentCashbackPercent website')
        .lean();

      if (!coupon) {
        res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
        return;
      }

      // Check if coupon is expired
      if (coupon.expiryDate < new Date()) {
        res.status(410).json({
          success: false,
          message: 'Coupon has expired'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          coupon
        }
      });
    } catch (error) {
      logger.error('Get coupon by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get coupon categories
   */
  async getCouponCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Coupon.aggregate([
        { $match: { isActive: true, expiryDate: { $gt: new Date() } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { name: '$_id', count: 1, _id: 0 } }
      ]);

      res.json({
        success: true,
        data: {
          categories
        }
      });
    } catch (error) {
      logger.error('Get coupon categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Search coupons
   */
  async searchCoupons(req: Request, res: Response): Promise<void> {
    try {
      const { q, store, category, limit = 20 } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const filter: any = {
        isActive: true,
        expiryDate: { $gt: new Date() },
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { code: { $regex: q, $options: 'i' } }
        ]
      };

      if (store) filter.storeId = store;
      if (category) filter.category = category;

      const coupons = await Coupon.find(filter)
        .populate('storeId', 'name slug logoUrl currentCashbackPercent')
        .sort({ priority: -1, createdAt: -1 })
        .limit(parseInt(limit as string))
        .lean();

      res.json({
        success: true,
        data: {
          coupons,
          query: q,
          store: store || null,
          category: category || null
        }
      });
    } catch (error) {
      logger.error('Search coupons error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get exclusive coupons
   */
  async getExclusiveCoupons(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      const coupons = await Coupon.find({
        isActive: true,
        isExclusive: true,
        expiryDate: { $gt: new Date() }
      })
        .populate('storeId', 'name slug logoUrl currentCashbackPercent')
        .sort({ priority: -1, createdAt: -1 })
        .limit(parseInt(limit as string))
        .lean();

      res.json({
        success: true,
        data: {
          coupons
        }
      });
    } catch (error) {
      logger.error('Get exclusive coupons error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Track coupon usage (when user clicks "Copy Code")
   */
  async trackCouponUsage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const coupon = await Coupon.findById(id);
      if (!coupon) {
        res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
        return;
      }

      // Increment usage count
      coupon.usageCount += 1;
      await coupon.save();

      logger.info(`Coupon usage tracked: ${coupon.code} (${coupon.title})`);

      res.json({
        success: true,
        message: 'Coupon usage tracked'
      });
    } catch (error) {
      logger.error('Track coupon usage error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new CouponController();