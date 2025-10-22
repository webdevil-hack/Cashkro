import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Store } from '../models/Store';
import { Category } from '../models/Category';
import { Offer } from '../models/Offer';
import { CashbackService } from '../services/CashbackService';
import { RedisService } from '../services/RedisService';

export class StoreController {
  private storeRepository = AppDataSource.getRepository(Store);
  private categoryRepository = AppDataSource.getRepository(Category);
  private offerRepository = AppDataSource.getRepository(Offer);
  private cashbackService = new CashbackService();
  private redisService = RedisService.getInstance();

  async getAllStores(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        category,
        featured,
        sort = 'priority',
      } = req.query;

      const cacheKey = `stores:${page}:${limit}:${search}:${category}:${featured}:${sort}`;
      const cached = await this.redisService.getCache(cacheKey);

      if (cached) {
        return res.json(cached);
      }

      const query = this.storeRepository
        .createQueryBuilder('store')
        .leftJoinAndSelect('store.categories', 'category')
        .where('store.status = :status', { status: 'active' });

      if (search) {
        query.andWhere('LOWER(store.name) LIKE LOWER(:search)', {
          search: `%${search}%`,
        });
      }

      if (category) {
        query.andWhere('category.slug = :categorySlug', {
          categorySlug: category,
        });
      }

      if (featured === 'true') {
        query.andWhere('store.isFeatured = true');
      }

      // Apply sorting
      switch (sort) {
        case 'name':
          query.orderBy('store.name', 'ASC');
          break;
        case 'cashback':
          query.orderBy('store.cashbackRate', 'DESC');
          break;
        case 'popular':
          query.orderBy('store.totalOrders', 'DESC');
          break;
        default:
          query.orderBy('store.priority', 'DESC');
      }

      const skip = (Number(page) - 1) * Number(limit);
      query.skip(skip).take(Number(limit));

      const [stores, total] = await query.getManyAndCount();

      const response = {
        success: true,
        data: {
          stores,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      };

      await this.redisService.setCache(cacheKey, response, 300); // Cache for 5 minutes

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getStoreBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const store = await this.storeRepository.findOne({
        where: { slug, status: 'active' },
        relations: ['categories', 'offers'],
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found',
        });
      }

      // Get active offers for the store
      const activeOffers = await this.offerRepository.find({
        where: {
          storeId: store.id,
          status: 'active',
        },
        order: {
          priority: 'DESC',
          createdAt: 'DESC',
        },
      });

      res.json({
        success: true,
        data: {
          store: {
            ...store,
            offers: activeOffers,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedStores(req: Request, res: Response, next: NextFunction) {
    try {
      const cached = await this.redisService.getCache('stores:featured');

      if (cached) {
        return res.json(cached);
      }

      const stores = await this.storeRepository.find({
        where: {
          isFeatured: true,
          status: 'active',
        },
        order: {
          priority: 'DESC',
        },
        take: 12,
      });

      const response = {
        success: true,
        data: { stores },
      };

      await this.redisService.setCache('stores:featured', response, 3600); // Cache for 1 hour

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPopularStores(req: Request, res: Response, next: NextFunction) {
    try {
      const cached = await this.redisService.getCache('stores:popular');

      if (cached) {
        return res.json(cached);
      }

      const stores = await this.storeRepository.find({
        where: {
          isPopular: true,
          status: 'active',
        },
        order: {
          totalOrders: 'DESC',
        },
        take: 12,
      });

      const response = {
        success: true,
        data: { stores },
      };

      await this.redisService.setCache('stores:popular', response, 3600);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTopCashbackStores(req: Request, res: Response, next: NextFunction) {
    try {
      const cached = await this.redisService.getCache('stores:top-cashback');

      if (cached) {
        return res.json(cached);
      }

      const stores = await this.storeRepository.find({
        where: {
          status: 'active',
        },
        order: {
          cashbackRate: 'DESC',
        },
        take: 12,
      });

      const response = {
        success: true,
        data: { stores },
      };

      await this.redisService.setCache('stores:top-cashback', response, 3600);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async visitStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const { offerId } = req.query;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Please login to earn cashback',
        });
      }

      const { clickId, redirectUrl } = await this.cashbackService.createClickTracking(
        userId,
        storeId,
        offerId as string
      );

      res.json({
        success: true,
        data: {
          clickId,
          redirectUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async searchStores(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit = 10 } = req.query;

      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json({
          success: true,
          data: { stores: [] },
        });
      }

      const stores = await this.storeRepository
        .createQueryBuilder('store')
        .where('store.status = :status', { status: 'active' })
        .andWhere('LOWER(store.name) LIKE LOWER(:search)', {
          search: `%${q}%`,
        })
        .orderBy('store.priority', 'DESC')
        .limit(Number(limit))
        .getMany();

      res.json({
        success: true,
        data: { stores },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const cached = await this.redisService.getCache('categories:all');

      if (cached) {
        return res.json(cached);
      }

      const categories = await this.categoryRepository.find({
        where: { isActive: true },
        order: { priority: 'DESC', name: 'ASC' },
      });

      const response = {
        success: true,
        data: { categories },
      };

      await this.redisService.setCache('categories:all', response, 7200); // Cache for 2 hours

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getStoresByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categorySlug } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const category = await this.categoryRepository.findOne({
        where: { slug: categorySlug, isActive: true },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      const query = this.storeRepository
        .createQueryBuilder('store')
        .leftJoin('store.categories', 'category')
        .where('category.id = :categoryId', { categoryId: category.id })
        .andWhere('store.status = :status', { status: 'active' })
        .orderBy('store.priority', 'DESC');

      const skip = (Number(page) - 1) * Number(limit);
      query.skip(skip).take(Number(limit));

      const [stores, total] = await query.getManyAndCount();

      res.json({
        success: true,
        data: {
          category,
          stores,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}