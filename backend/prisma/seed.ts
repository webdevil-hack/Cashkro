import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cashkaro-clone.com' },
    update: {},
    create: {
      email: 'admin@cashkaro-clone.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
      referralCode: 'ADMIN001',
    },
  })

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      isEmailVerified: true,
      referralCode: 'USER001',
      walletBalance: 1500.00,
      totalEarned: 5000.00,
    },
  })

  // Create categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, computers and more' },
    { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, accessories' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Furniture, decor, appliances' },
    { name: 'Beauty', slug: 'beauty', description: 'Cosmetics, skincare, personal care' },
    { name: 'Food & Dining', slug: 'food-dining', description: 'Restaurants, food delivery' },
    { name: 'Travel', slug: 'travel', description: 'Hotels, flights, vacation packages' },
    { name: 'Books', slug: 'books', description: 'Books, ebooks, audiobooks' },
    { name: 'Sports', slug: 'sports', description: 'Sports equipment, fitness gear' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create stores
  const stores = [
    {
      name: 'Amazon',
      slug: 'amazon',
      description: 'World\'s largest online marketplace',
      logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&h=400&fit=crop',
      website: 'https://amazon.in',
      cashbackRate: 2.5,
      maxCashback: 1000,
      category: 'Electronics',
      tags: ['electronics', 'books', 'fashion'],
      isFeatured: true,
      priority: 10,
    },
    {
      name: 'Flipkart',
      slug: 'flipkart',
      description: 'India\'s leading e-commerce platform',
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      website: 'https://flipkart.com',
      cashbackRate: 3.0,
      maxCashback: 2000,
      category: 'Electronics',
      tags: ['electronics', 'fashion', 'home'],
      isFeatured: true,
      priority: 9,
    },
    {
      name: 'Myntra',
      slug: 'myntra',
      description: 'Fashion and lifestyle destination',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      website: 'https://myntra.com',
      cashbackRate: 4.5,
      maxCashback: 1500,
      category: 'Fashion',
      tags: ['fashion', 'clothing', 'accessories'],
      isFeatured: true,
      priority: 8,
    },
    {
      name: 'Nykaa',
      slug: 'nykaa',
      description: 'Beauty and wellness products',
      logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop',
      website: 'https://nykaa.com',
      cashbackRate: 5.0,
      maxCashback: 800,
      category: 'Beauty',
      tags: ['beauty', 'cosmetics', 'skincare'],
      isFeatured: true,
      priority: 7,
    },
    {
      name: 'Zomato',
      slug: 'zomato',
      description: 'Food delivery and dining',
      logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop',
      website: 'https://zomato.com',
      cashbackRate: 6.0,
      maxCashback: 500,
      category: 'Food & Dining',
      tags: ['food', 'restaurants', 'delivery'],
      isFeatured: true,
      priority: 6,
    },
    {
      name: 'BookMyShow',
      slug: 'bookmyshow',
      description: 'Movie tickets and entertainment',
      logo: 'https://images.unsplash.com/photo-1489599511344-f4c6c7c8e3b8?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1489599511344-f4c6c7c8e3b8?w=800&h=400&fit=crop',
      website: 'https://bookmyshow.com',
      cashbackRate: 3.5,
      maxCashback: 300,
      category: 'Entertainment',
      tags: ['movies', 'entertainment', 'tickets'],
      isFeatured: false,
      priority: 5,
    },
  ]

  for (const store of stores) {
    await prisma.store.upsert({
      where: { slug: store.slug },
      update: {},
      create: store,
    })
  }

  // Get created stores for coupons and deals
  const createdStores = await prisma.store.findMany()

  // Create coupons
  const coupons = [
    {
      title: 'Get 10% Off on Electronics',
      description: 'Save 10% on all electronics purchases above ₹5000',
      code: 'ELEC10',
      type: 'CODE' as const,
      discountType: 'PERCENTAGE' as const,
      discountValue: 10,
      minOrderValue: 5000,
      storeId: createdStores.find(s => s.slug === 'amazon')?.id || createdStores[0].id,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    {
      title: 'Flat ₹500 Off on Fashion',
      description: 'Get flat ₹500 discount on fashion items above ₹2000',
      code: 'FASHION500',
      type: 'CODE' as const,
      discountType: 'FIXED' as const,
      discountValue: 500,
      minOrderValue: 2000,
      storeId: createdStores.find(s => s.slug === 'myntra')?.id || createdStores[0].id,
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    },
    {
      title: 'Free Delivery on Beauty Products',
      description: 'Get free delivery on all beauty products',
      code: 'FREEDEL',
      type: 'CODE' as const,
      discountType: 'FREE_SHIPPING' as const,
      discountValue: 0,
      storeId: createdStores.find(s => s.slug === 'nykaa')?.id || createdStores[0].id,
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    },
  ]

  for (const coupon of coupons) {
    await prisma.coupon.create({
      data: coupon,
    })
  }

  // Create deals
  const deals = [
    {
      title: 'iPhone 15 Pro Max - Limited Time Offer',
      description: 'Get the latest iPhone with exclusive cashback',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      originalPrice: 159900,
      discountedPrice: 149900,
      discountPercent: 6,
      category: 'Electronics',
      tags: ['iphone', 'smartphone', 'apple'],
      isFeatured: true,
      priority: 10,
      storeId: createdStores.find(s => s.slug === 'amazon')?.id || createdStores[0].id,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    {
      title: 'Fashion Sale - Up to 70% Off',
      description: 'Biggest fashion sale of the year',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
      discountPercent: 70,
      category: 'Fashion',
      tags: ['fashion', 'sale', 'clothing'],
      isFeatured: true,
      priority: 9,
      storeId: createdStores.find(s => s.slug === 'myntra')?.id || createdStores[0].id,
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    },
  ]

  for (const deal of deals) {
    await prisma.deal.create({
      data: deal,
    })
  }

  // Create banners
  const banners = [
    {
      title: 'Welcome to CashKaro Clone',
      description: 'Start earning cashback today!',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
      link: '/stores',
      type: 'PROMOTIONAL' as const,
      position: 'home',
      priority: 10,
    },
    {
      title: 'Featured Store of the Month',
      description: 'Amazon - Up to 5% Cashback',
      image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=1200&h=400&fit=crop',
      link: '/stores/amazon',
      type: 'FEATURED_STORE' as const,
      position: 'home',
      priority: 9,
    },
  ]

  for (const banner of banners) {
    await prisma.banner.create({
      data: banner,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: admin@cashkaro-clone.com / admin123`)
  console.log(`👤 Test user: user@test.com / user123`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })