import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCoupons = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const storeId = req.query.storeId as string;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      endDate: {
        gte: new Date()
      }
    };

    if (storeId) {
      where.storeId = storeId;
    }

    if (category) {
      where.store = {
        category: category
      };
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.coupon.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      coupons,
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
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            website: true,
            category: true
          }
        }
      }
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStoreCoupons = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const coupons = await prisma.coupon.findMany({
      where: {
        storeId,
        isActive: true,
        endDate: {
          gte: new Date()
        }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    res.json(coupons);
  } catch (error) {
    console.error('Get store coupons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchCoupons = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchTerm = query.trim();

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where: {
          isActive: true,
          endDate: {
            gte: new Date()
          },
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { code: { contains: searchTerm, mode: 'insensitive' } },
            {
              store: {
                name: { contains: searchTerm, mode: 'insensitive' }
              }
            }
          ]
        },
        skip,
        take: limit,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.coupon.count({
        where: {
          isActive: true,
          endDate: {
            gte: new Date()
          },
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { code: { contains: searchTerm, mode: 'insensitive' } },
            {
              store: {
                name: { contains: searchTerm, mode: 'insensitive' }
              }
            }
          ]
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      coupons,
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
    console.error('Search coupons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            website: true
          }
        }
      }
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'Coupon is not active' });
    }

    if (coupon.endDate && coupon.endDate < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    // Increment usage count
    await prisma.coupon.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1
        }
      }
    });

    res.json({
      valid: true,
      coupon,
      message: 'Coupon is valid'
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};