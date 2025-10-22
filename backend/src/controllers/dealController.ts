import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDeals = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const featured = req.query.featured === 'true';
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      endDate: {
        gte: new Date()
      }
    };

    if (category) {
      where.category = category;
    }

    if (featured) {
      where.isFeatured = true;
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
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
              cashbackRate: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.deal.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      deals,
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
    console.error('Get deals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            website: true,
            cashbackRate: true,
            category: true
          }
        }
      }
    });

    if (!deal || !deal.isActive) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Increment click count
    await prisma.deal.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1
        }
      }
    });

    res.json(deal);
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFeaturedDeals = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;

    const deals = await prisma.deal.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        endDate: {
          gte: new Date()
        }
      },
      take: limit,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            cashbackRate: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(deals);
  } catch (error) {
    console.error('Get featured deals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStoreDeals = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const deals = await prisma.deal.findMany({
      where: {
        storeId,
        isActive: true,
        endDate: {
          gte: new Date()
        }
      },
      take: limit,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(deals);
  } catch (error) {
    console.error('Get store deals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchDeals = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchTerm = query.trim();

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where: {
          isActive: true,
          endDate: {
            gte: new Date()
          },
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm] } },
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
              cashbackRate: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.deal.count({
        where: {
          isActive: true,
          endDate: {
            gte: new Date()
          },
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm] } },
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
      deals,
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
    console.error('Search deals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};