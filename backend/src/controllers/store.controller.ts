// path: backend/src/controllers/store.controller.ts
import { Request, Response } from 'express';
import { Store } from '../models/store.model';
import { Coupon } from '../models/coupon.model';
import { queryValidation, storeValidation } from '../utils/validator';
import logger from '../utils/logger';

export class StoreController {
  /**
   * Get all stores with pagination and filters
   */
  async getStores(req: Request, res: Response): Promise<void> {
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

      const { error: filterError, value: filterValue } = queryValidation.storeQuery.validate(req.query);
      if (filterError) {
        res.status(400).json({
          success: false,
          message: 'Invalid filter parameters',
          errors: filterError.details.map(detail => detail.message)
        });
        return;
      }

      const { page, perPage, sort } = queryValue;
      const { category, search, active, featured, minCashback, maxCashback, tags } = filterValue;

      // Build filter object
      const filter: any = {};

      if (active !== undefined) filter.active = active;
      if (featured !== undefined) filter.featured = featured;
      if (category) filter.categories = { $in: [category] };
      if (tags) filter.tags = { $in: tags.split(',') };
      if (minCashback !== undefined || maxCashback !== undefined) {
        filter.currentCashbackPercent = {};
        if (minCashback !== undefined) filter.currentCashbackPercent.$gte = minCashback;
        if (maxCashback !== undefined) filter.currentCashbackPercent.$lte = maxCashback;
      }

      // Build search query
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * perPage;

      // Get stores with pagination
      const stores = await Store.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(perPage)
        .select('-affiliateLinks') // Exclude sensitive affiliate data
        .lean();

      // Get total count
      const total = await Store.countDocuments(filter);

      // Calculate pagination info
      const totalPages = Math.ceil(total / perPage);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: {
          stores,
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
      logger.error('Get stores error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get store by slug
   */
  async getStoreBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const store = await Store.findOne({ slug, active: true })
        .select('-affiliateLinks') // Exclude sensitive affiliate data
        .lean();

      if (!store) {
        res.status(404).json({
          success: false,
          message: 'Store not found'
        });
        return;
      }

      // Get active coupons for this store
      const coupons = await Coupon.find({
        storeId: store._id,
        isActive: true,
        expiryDate: { $gt: new Date() }
      })
        .sort({ priority: -1, createdAt: -1 })
        .select('-storeId')
        .lean();

      res.json({
        success: true,
        data: {
          store: {
            ...store,
            coupons
          }
        }
      });
    } catch (error) {
      logger.error('Get store by slug error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get store categories
   */
  async getStoreCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Store.aggregate([
        { $match: { active: true } },
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
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
      logger.error('Get store categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get featured stores
   */
  async getFeaturedStores(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      const stores = await Store.find({
        active: true,
        featured: true
      })
        .sort({ 'stats.clicks': -1, currentCashbackPercent: -1 })
        .limit(parseInt(limit as string))
        .select('-affiliateLinks')
        .lean();

      res.json({
        success: true,
        data: {
          stores
        }
      });
    } catch (error) {
      logger.error('Get featured stores error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get store statistics
   */
  async getStoreStats(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const store = await Store.findOne({ slug, active: true });
      if (!store) {
        res.status(404).json({
          success: false,
          message: 'Store not found'
        });
        return;
      }

      // Get additional stats
      const totalCoupons = await Coupon.countDocuments({
        storeId: store._id,
        isActive: true
      });

      const activeCoupons = await Coupon.countDocuments({
        storeId: store._id,
        isActive: true,
        expiryDate: { $gt: new Date() }
      });

      res.json({
        success: true,
        data: {
          stats: {
            ...store.stats,
            totalCoupons,
            activeCoupons,
            conversionRate: store.conversionRate
          }
        }
      });
    } catch (error) {
      logger.error('Get store stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Search stores
   */
  async searchStores(req: Request, res: Response): Promise<void> {
    try {
      const { q, category, limit = 20 } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const filter: any = {
        active: true,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q as string, 'i')] } }
        ]
      };

      if (category) {
        filter.categories = { $in: [category] };
      }

      const stores = await Store.find(filter)
        .sort({ 'stats.clicks': -1, currentCashbackPercent: -1 })
        .limit(parseInt(limit as string))
        .select('-affiliateLinks')
        .lean();

      res.json({
        success: true,
        data: {
          stores,
          query: q,
          category: category || null
        }
      });
    } catch (error) {
      logger.error('Search stores error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get store coupons
   */
  async getStoreCoupons(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const { category, isExclusive, limit = 20 } = req.query;

      const store = await Store.findOne({ slug, active: true });
      if (!store) {
        res.status(404).json({
          success: false,
          message: 'Store not found'
        });
        return;
      }

      const filter: any = {
        storeId: store._id,
        isActive: true,
        expiryDate: { $gt: new Date() }
      };

      if (category) filter.category = category;
      if (isExclusive !== undefined) filter.isExclusive = isExclusive === 'true';

      const coupons = await Coupon.find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .limit(parseInt(limit as string))
        .select('-storeId')
        .lean();

      res.json({
        success: true,
        data: {
          coupons,
          store: {
            name: store.name,
            slug: store.slug,
            logoUrl: store.logoUrl
          }
        }
      });
    } catch (error) {
      logger.error('Get store coupons error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get trending stores
   */
  async getTrendingStores(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10, period = '7d' } = req.query;

      // Calculate date range based on period
      let days = 7;
      if (period === '1d') days = 1;
      else if (period === '30d') days = 30;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const stores = await Store.aggregate([
        {
          $lookup: {
            from: 'clicks',
            localField: '_id',
            foreignField: 'storeId',
            as: 'clicks'
          }
        },
        {
          $addFields: {
            recentClicks: {
              $filter: {
                input: '$clicks',
                cond: { $gte: ['$$this.createdAt', startDate] }
              }
            }
          }
        },
        {
          $addFields: {
            clickCount: { $size: '$recentClicks' }
          }
        },
        {
          $match: {
            active: true,
            clickCount: { $gt: 0 }
          }
        },
        {
          $sort: { clickCount: -1, currentCashbackPercent: -1 }
        },
        {
          $limit: parseInt(limit as string)
        },
        {
          $project: {
            name: 1,
            slug: 1,
            logoUrl: 1,
            currentCashbackPercent: 1,
            cashbackType: 1,
            categories: 1,
            clickCount: 1,
            stats: 1
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          stores,
          period
        }
      });
    } catch (error) {
      logger.error('Get trending stores error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new StoreController();