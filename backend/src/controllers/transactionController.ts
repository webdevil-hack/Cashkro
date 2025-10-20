import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createTransaction = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};

export const updateTransactionStatus = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ error: 'Not implemented yet' });
};