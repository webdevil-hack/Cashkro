import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { getClientIp } from '../utils/helpers';

const prisma = new PrismaClient();

export const getStores = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const featured = req.query.featured === 'true';
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { name: 'asc' }
        ],
        include: {
          _count: {
            select: {
              coupons: { where: { isActive: true } },
              deals: { where: { isActive: true } }
            }
          }
        }
      }),
      prisma.store.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      stores,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStore = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const store = await prisma.store.findUnique({
      where: { slug },
      include: {
        coupons: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        deals: {
          where: { isActive: true },
          orderBy: { priority: 'desc' },
          take: 10
        },
        _count: {
          select: {
            coupons: { where: { isActive: true } },
            deals: { where: { isActive: true } },
            cashbacks: true
          }
        }
      }
    });

    if (!store || !store.isActive) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeaturedStores = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 12;

    const stores = await prisma.store.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      take: limit,
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            coupons: { where: { isActive: true } },
            deals: { where: { isActive: true } }
          }
        }
      }
    });

    res.json(stores);
  } catch (error) {
    console.error('Get featured stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStoresByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where: {
          isActive: true,
          category: category
        },
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { name: 'asc' }
        ],
        include: {
          _count: {
            select: {
              coupons: { where: { isActive: true } },
              deals: { where: { isActive: true } }
            }
          }
        }
      }),
      prisma.store.count({
        where: {
          isActive: true,
          category: category
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      stores,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get stores by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchStores = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchTerm = query.trim();

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm] } }
          ]
        },
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { name: 'asc' }
        ],
        include: {
          _count: {
            select: {
              coupons: { where: { isActive: true } },
              deals: { where: { isActive: true } }
            }
          }
        }
      }),
      prisma.store.count({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm] } }
          ]
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      stores,
      query: searchTerm,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Search stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const trackStoreClick = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.id;
    const ipAddress = getClientIp(req);
    const userAgent = req.get('User-Agent') || '';
    const referrer = req.get('Referer') || '';

    // Verify store exists
    const store = await prisma.store.findUnique({
      where: { id },
      select: { id: true, website: true }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Track the click
    await prisma.clickTracking.create({
      data: {
        userId,
        storeId: id,
        ipAddress,
        userAgent,
        referrer
      }
    });

    res.json({ 
      message: 'Click tracked successfully',
      redirectUrl: store.website
    });
  } catch (error) {
    console.error('Track store click error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addToFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if already in favorites
    const existingFavorite = await prisma.userFavorite.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId: id
        }
      }
    });

    if (existingFavorite) {
      return res.status(400).json({ error: 'Store already in favorites' });
    }

    // Add to favorites
    await prisma.userFavorite.create({
      data: {
        userId,
        storeId: id
      }
    });

    res.json({ message: 'Store added to favorites' });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await prisma.userFavorite.delete({
      where: {
        userId_storeId: {
          userId,
          storeId: id
        }
      }
    });

    res.json({ message: 'Store removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.userFavorite.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          store: {
            include: {
              _count: {
                select: {
                  coupons: { where: { isActive: true } },
                  deals: { where: { isActive: true } }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.userFavorite.count({ where: { userId } })
    ]);

    const stores = favorites.map(fav => fav.store);
    const totalPages = Math.ceil(total / limit);

    res.json({
      stores,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};