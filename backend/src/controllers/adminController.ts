import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalStores,
      totalTransactions,
      totalCashback,
      recentUsers,
      recentTransactions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.store.count({ where: { isActive: true } }),
      prisma.transaction.count(),
      prisma.cashback.aggregate({
        _sum: { amount: true }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalStores,
        totalTransactions,
        totalCashback: totalCashback._sum.amount || 0
      },
      recentUsers,
      recentTransactions
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getUser = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const createStore = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const updateStore = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const deleteStore = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const createCoupon = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const updateCoupon = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const deleteCoupon = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const createDeal = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const updateDeal = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const deleteDeal = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getCashbacks = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getWithdrawals = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};