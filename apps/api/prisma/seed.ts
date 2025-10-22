import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ck.local' },
    update: {},
    create: {
      email: 'admin@ck.local',
      passwordHash: adminPass,
      name: 'Admin',
      isAdmin: true,
      referralCode: 'admin_ref',
    },
  });

  const userPass = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@ck.local' },
    update: {},
    create: {
      email: 'user@ck.local',
      passwordHash: userPass,
      name: 'Demo User',
      referralCode: 'user_ref',
    },
  });

  const amazon = await prisma.merchant.upsert({
    where: { name: 'Amazon' },
    update: {},
    create: {
      name: 'Amazon',
      websiteUrl: 'https://www.amazon.in',
      logoUrl: 'https://logo.clearbit.com/amazon.in',
    },
  });

  const flipkart = await prisma.merchant.upsert({
    where: { name: 'Flipkart' },
    update: {},
    create: {
      name: 'Flipkart',
      websiteUrl: 'https://www.flipkart.com',
      logoUrl: 'https://logo.clearbit.com/flipkart.com',
    },
  });

  await prisma.offer.upsert({
    where: { id: 'seed_amazon_offer' },
    update: {},
    create: {
      id: 'seed_amazon_offer',
      merchantId: amazon.id,
      title: 'Up to 5% Cashback on Amazon',
      description: 'Earn cashback on your Amazon purchases via our link.',
      baseCashbackRate: 0.05,
      affiliateUrlTemplate: 'https://www.amazon.in?aff_sub={clickId}',
    },
  });

  await prisma.offer.upsert({
    where: { id: 'seed_flipkart_offer' },
    update: {},
    create: {
      id: 'seed_flipkart_offer',
      merchantId: flipkart.id,
      title: 'Up to 6% Cashback on Flipkart',
      description: 'Shop on Flipkart and earn cashback via our link.',
      baseCashbackRate: 0.06,
      affiliateUrlTemplate: 'https://www.flipkart.com?aff_sub={clickId}',
    },
  });

  console.log({ admin, user, amazon, flipkart });
}

main().finally(async () => {
  await prisma.$disconnect();
});
