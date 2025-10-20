import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        walletBalance: true,
        totalEarned: true,
        totalWithdrawn: true,
        referralCode: true,
        isEmailVerified: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getWalletBalance = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getReferrals = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};