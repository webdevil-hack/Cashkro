import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getCashbacks = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getCashback = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const confirmCashback = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getPendingCashbacks = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};