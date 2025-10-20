import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { createClient } from 'ioredis';

const app = express();
const prisma = new PrismaClient();
const redis = new createClient(process.env.REDIS_URL ?? 'redis://localhost:6379');

const port = Number(process.env.API_PORT || 4000);
const webOrigin = process.env.WEB_ORIGIN || 'http://localhost:3000';
const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change';

app.use(cors({ origin: webOrigin, credentials: true }));
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

// Auth middleware (simple JWT)
function authRequired(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, referredByCode } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.hash(password, 10);

  const referralCode = `u_${Math.random().toString(36).slice(2, 10)}`;

  let referredByUser = null as any;
  if (referredByCode) {
    referredByUser = await prisma.user.findUnique({ where: { referralCode: referredByCode } });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        referralCode,
        referredById: referredByUser?.id || null,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode } });
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Email already exists' });
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const bcrypt = await import('bcryptjs');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode } });
});

// Merchants and offers
app.get('/api/merchants', async (_req, res) => {
  const merchants = await prisma.merchant.findMany({ where: { isActive: true }, include: { offers: { where: { isActive: true } } } });
  res.json({ merchants });
});

app.get('/api/offers', async (_req, res) => {
  const offers = await prisma.offer.findMany({ where: { isActive: true }, include: { merchant: true } });
  res.json({ offers });
});

// Click redirect to affiliate network
app.get('/r/:offerId', async (req, res) => {
  const { offerId } = req.params;
  const userId = (req.query.uid as string) || undefined;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'] as string | undefined;

  const offer = await prisma.offer.findUnique({ where: { id: offerId }, include: { merchant: true } });
  if (!offer || !offer.isActive || !offer.merchant.isActive) return res.status(404).send('Offer not found');

  const clickId = `ck_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const redirectUrl = offer.affiliateUrlTemplate
    .replace('{clickId}', encodeURIComponent(clickId))
    .replace('{userId}', encodeURIComponent(userId || ''));

  await prisma.click.create({
    data: {
      clickId,
      ip: ip || null,
      userAgent: userAgent || null,
      redirectUrlUsed: redirectUrl,
      userId: userId || null,
      offerId: offer.id,
      merchantId: offer.merchantId,
    },
  });

  res.redirect(302, redirectUrl);
});

// Webhook endpoint to receive transaction events from affiliate networks
app.post('/api/webhooks/network', async (req, res) => {
  // Expect payload with: clickId, amount, status, merchantName, eventAt
  const { clickId, amount, status, merchantName, eventAt, networkTransactionId } = req.body || {};
  if (!merchantName) return res.status(400).json({ error: 'merchantName required' });

  const merchant = await prisma.merchant.findFirst({ where: { name: merchantName } });
  if (!merchant) return res.status(404).json({ error: 'Unknown merchant' });

  const click = clickId ? await prisma.click.findUnique({ where: { clickId } }) : null;

  const normalizedStatus = ['CONFIRMED', 'PENDING', 'CANCELLED'].includes(String(status)) ? String(status) : 'PENDING';

  const transaction = await prisma.transaction.upsert({
    where: { networkTransactionId: networkTransactionId || '' },
    create: {
      networkTransactionId: networkTransactionId || null,
      clickId: click?.clickId || null,
      userId: click?.userId || null,
      merchantId: merchant.id,
      offerId: click?.offerId || null,
      amount: amount ? new PrismaClient.Prisma.Decimal(amount) : null,
      cashbackAmount: amount ? new PrismaClient.Prisma.Decimal(Number(amount) * 0.05) : null,
      status: normalizedStatus as any,
      eventAt: eventAt ? new Date(eventAt) : new Date(),
    },
    update: {
      status: normalizedStatus as any,
      amount: amount ? new PrismaClient.Prisma.Decimal(amount) : undefined,
      cashbackAmount: amount ? new PrismaClient.Prisma.Decimal(Number(amount) * 0.05) : undefined,
      eventAt: eventAt ? new Date(eventAt) : undefined,
    },
  });

  // Simple referral bonus when first CONFIRMED for a referred user
  if (transaction.status === 'CONFIRMED' && transaction.userId) {
    const user = await prisma.user.findUnique({ where: { id: transaction.userId } });
    if (user?.referredById) {
      const existing = await prisma.referralBonus.findFirst({ where: { referredUserId: user.id } });
      if (!existing) {
        await prisma.referralBonus.create({
          data: {
            userId: user.referredById,
            referredUserId: user.id,
            amount: new PrismaClient.Prisma.Decimal(25), // flat bonus
            status: 'CONFIRMED' as any,
          },
        });
      }
    }
  }

  res.json({ ok: true });
});

// Wallet and transactions for logged-in user
app.get('/api/me/summary', authRequired, async (req: any, res) => {
  const userId = req.user.userId as string;
  const [pending, confirmed, withdrawals, referralBonuses] = await Promise.all([
    prisma.transaction.aggregate({ _sum: { cashbackAmount: true }, where: { userId, status: 'PENDING' } }),
    prisma.transaction.aggregate({ _sum: { cashbackAmount: true }, where: { userId, status: 'CONFIRMED' } }),
    prisma.walletWithdrawal.aggregate({ _sum: { amount: true }, where: { userId, status: { in: ['PROCESSING', 'COMPLETED'] } } }),
    prisma.referralBonus.aggregate({ _sum: { amount: true }, where: { userId, status: 'CONFIRMED' } }),
  ]);

  const pendingAmt = Number(pending._sum.cashbackAmount || 0);
  const confirmedAmt = Number(confirmed._sum.cashbackAmount || 0);
  const withdrawnAmt = Number(withdrawals._sum.amount || 0);
  const referralAmt = Number(referralBonuses._sum.amount || 0);

  res.json({
    pendingCashback: pendingAmt,
    confirmedCashback: confirmedAmt,
    referralEarnings: referralAmt,
    availableToWithdraw: Math.max(confirmedAmt + referralAmt - withdrawnAmt, 0),
  });
});

app.post('/api/me/withdrawals', authRequired, async (req: any, res) => {
  const userId = req.user.userId as string;
  const { amount, method, details } = req.body || {};
  const numericAmount = Number(amount);
  if (!numericAmount || numericAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const summary = await prisma.transaction.aggregate({ _sum: { cashbackAmount: true }, where: { userId, status: 'CONFIRMED' } });
  const referral = await prisma.referralBonus.aggregate({ _sum: { amount: true }, where: { userId, status: 'CONFIRMED' } });
  const withdrawn = await prisma.walletWithdrawal.aggregate({ _sum: { amount: true }, where: { userId, status: { in: ['PROCESSING', 'COMPLETED'] } } });

  const available = Number(summary._sum.cashbackAmount || 0) + Number(referral._sum.amount || 0) - Number(withdrawn._sum.amount || 0);
  if (numericAmount > available) return res.status(400).json({ error: 'Amount exceeds available balance' });

  const w = await prisma.walletWithdrawal.create({ data: { userId, amount: new PrismaClient.Prisma.Decimal(numericAmount), method: method || null, details: details || null } });
  res.json({ withdrawal: w });
});

// Admin endpoints (minimal)
app.post('/api/admin/merchants', authRequired, async (req: any, res) => {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Forbidden' });
  const { name, logoUrl, websiteUrl, isActive } = req.body || {};
  const merchant = await prisma.merchant.create({ data: { name, logoUrl, websiteUrl, isActive: isActive ?? true } });
  res.json({ merchant });
});

app.post('/api/admin/offers', authRequired, async (req: any, res) => {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Forbidden' });
  const { merchantId, title, description, baseCashbackRate, affiliateUrlTemplate, clickIdParam, isActive } = req.body || {};
  const offer = await prisma.offer.create({ data: { merchantId, title, description, baseCashbackRate, affiliateUrlTemplate, clickIdParam: clickIdParam || 'ck_click_id', isActive: isActive ?? true } });
  res.json({ offer });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
