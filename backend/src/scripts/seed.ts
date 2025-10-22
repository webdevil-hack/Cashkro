// path: backend/src/scripts/seed.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Store } from '../models/store.model';
import { Coupon } from '../models/coupon.model';
import { Referral } from '../models/referral.model';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cashkaro';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB for seeding');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async (): Promise<void> => {
  try {
    logger.info('Seeding users...');

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      logger.info('Users already exist, skipping user seeding');
      return;
    }

    const users = [
      {
        name: 'Admin User',
        email: 'admin@cashkaro-clone.com',
        passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKz2G', // admin123
        role: 'admin',
        wallet: { available: 1000, pending: 0 },
        referralCode: 'ADMIN001',
        isBlocked: false
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKz2G', // password123
        role: 'user',
        wallet: { available: 250, pending: 50 },
        referralCode: 'JOHN123',
        isBlocked: false
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKz2G', // password123
        role: 'user',
        wallet: { available: 150, pending: 25 },
        referralCode: 'JANE456',
        isBlocked: false
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKz2G', // password123
        role: 'user',
        wallet: { available: 75, pending: 0 },
        referralCode: 'MIKE789',
        isBlocked: false
      }
    ];

    await User.insertMany(users);
    logger.info(`Seeded ${users.length} users`);
  } catch (error) {
    logger.error('Error seeding users:', error);
    throw error;
  }
};

const seedStores = async (): Promise<void> => {
  try {
    logger.info('Seeding stores...');

    // Check if stores already exist
    const existingStores = await Store.countDocuments();
    if (existingStores > 0) {
      logger.info('Stores already exist, skipping store seeding');
      return;
    }

    const stores = [
      {
        name: 'Amazon India',
        slug: 'amazon-india',
        logoUrl: 'https://via.placeholder.com/150x150/FF9900/FFFFFF?text=Amazon',
        bannerUrl: 'https://via.placeholder.com/800x200/FF9900/FFFFFF?text=Amazon+India',
        description: 'Shop millions of products with fast delivery and great deals',
        categories: ['Electronics', 'Fashion', 'Home & Garden', 'Books'],
        currentCashbackPercent: 5.0,
        cashbackType: 'percent',
        minOrderValue: 500,
        maxCashback: 1000,
        affiliateLinks: [
          {
            network: 'amazon',
            link: 'https://amazon.in',
            partnerId: 'amazon123',
            isActive: true,
            commissionRate: 5.0
          }
        ],
        active: true,
        featured: true,
        terms: 'Cashback credited within 30 days of order delivery. Valid on all products except gift cards.',
        website: 'https://amazon.in',
        appStoreUrl: 'https://apps.apple.com/app/amazon-india/id523592028',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=in.amazon.mShop.android.shopping',
        socialLinks: {
          facebook: 'https://facebook.com/amazonindia',
          twitter: 'https://twitter.com/amazonIN',
          instagram: 'https://instagram.com/amazonindia'
        },
        tags: ['electronics', 'fashion', 'home', 'books', 'prime']
      },
      {
        name: 'Flipkart',
        slug: 'flipkart',
        logoUrl: 'https://via.placeholder.com/150x150/2874F0/FFFFFF?text=Flipkart',
        bannerUrl: 'https://via.placeholder.com/800x200/2874F0/FFFFFF?text=Flipkart',
        description: 'India\'s leading e-commerce platform with great deals and offers',
        categories: ['Electronics', 'Fashion', 'Home & Garden', 'Mobiles'],
        currentCashbackPercent: 4.5,
        cashbackType: 'percent',
        minOrderValue: 300,
        maxCashback: 500,
        affiliateLinks: [
          {
            network: 'flipkart',
            link: 'https://flipkart.com',
            partnerId: 'flipkart123',
            isActive: true,
            commissionRate: 4.5
          }
        ],
        active: true,
        featured: true,
        terms: 'Cashback credited within 15 days of order delivery. Valid on all products.',
        website: 'https://flipkart.com',
        appStoreUrl: 'https://apps.apple.com/app/flipkart/id742044692',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.flipkart.android',
        socialLinks: {
          facebook: 'https://facebook.com/flipkart',
          twitter: 'https://twitter.com/flipkart',
          instagram: 'https://instagram.com/flipkart'
        },
        tags: ['electronics', 'fashion', 'mobiles', 'home']
      },
      {
        name: 'Myntra',
        slug: 'myntra',
        logoUrl: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Myntra',
        bannerUrl: 'https://via.placeholder.com/800x200/FF6B6B/FFFFFF?text=Myntra',
        description: 'Fashion and lifestyle destination with latest trends',
        categories: ['Fashion', 'Beauty', 'Lifestyle'],
        currentCashbackPercent: 6.0,
        cashbackType: 'percent',
        minOrderValue: 200,
        maxCashback: 300,
        affiliateLinks: [
          {
            network: 'cuelinks',
            link: 'https://myntra.com',
            partnerId: 'myntra123',
            isActive: true,
            commissionRate: 6.0
          }
        ],
        active: true,
        featured: false,
        terms: 'Cashback credited within 7 days of order delivery. Valid on fashion and beauty products.',
        website: 'https://myntra.com',
        appStoreUrl: 'https://apps.apple.com/app/myntra/id907394059',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.myntra.android',
        socialLinks: {
          facebook: 'https://facebook.com/myntra',
          twitter: 'https://twitter.com/myntra',
          instagram: 'https://instagram.com/myntra'
        },
        tags: ['fashion', 'beauty', 'lifestyle', 'trends']
      },
      {
        name: 'Zomato',
        slug: 'zomato',
        logoUrl: 'https://via.placeholder.com/150x150/FF4A4A/FFFFFF?text=Zomato',
        bannerUrl: 'https://via.placeholder.com/800x200/FF4A4A/FFFFFF?text=Zomato',
        description: 'Food delivery and restaurant discovery platform',
        categories: ['Food & Dining', 'Delivery'],
        currentCashbackPercent: 3.0,
        cashbackType: 'percent',
        minOrderValue: 100,
        maxCashback: 50,
        affiliateLinks: [
          {
            network: 'admitad',
            link: 'https://zomato.com',
            partnerId: 'zomato123',
            isActive: true,
            commissionRate: 3.0
          }
        ],
        active: true,
        featured: false,
        terms: 'Cashback credited within 24 hours of order completion. Valid on food orders only.',
        website: 'https://zomato.com',
        appStoreUrl: 'https://apps.apple.com/app/zomato-food-delivery/id434613896',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.application.zomato',
        socialLinks: {
          facebook: 'https://facebook.com/zomato',
          twitter: 'https://twitter.com/zomato',
          instagram: 'https://instagram.com/zomato'
        },
        tags: ['food', 'delivery', 'restaurants', 'dining']
      },
      {
        name: 'Swiggy',
        slug: 'swiggy',
        logoUrl: 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Swiggy',
        bannerUrl: 'https://via.placeholder.com/800x200/FF6B35/FFFFFF?text=Swiggy',
        description: 'Fast food delivery from your favorite restaurants',
        categories: ['Food & Dining', 'Delivery'],
        currentCashbackPercent: 2.5,
        cashbackType: 'percent',
        minOrderValue: 150,
        maxCashback: 40,
        affiliateLinks: [
          {
            network: 'impact',
            link: 'https://swiggy.com',
            partnerId: 'swiggy123',
            isActive: true,
            commissionRate: 2.5
          }
        ],
        active: true,
        featured: false,
        terms: 'Cashback credited within 48 hours of order completion. Valid on food orders only.',
        website: 'https://swiggy.com',
        appStoreUrl: 'https://apps.apple.com/app/swiggy-food-delivery/id989540920',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=in.swiggy.android',
        socialLinks: {
          facebook: 'https://facebook.com/swiggy',
          twitter: 'https://twitter.com/swiggy',
          instagram: 'https://instagram.com/swiggy'
        },
        tags: ['food', 'delivery', 'restaurants', 'fast']
      }
    ];

    await Store.insertMany(stores);
    logger.info(`Seeded ${stores.length} stores`);
  } catch (error) {
    logger.error('Error seeding stores:', error);
    throw error;
  }
};

const seedCoupons = async (): Promise<void> => {
  try {
    logger.info('Seeding coupons...');

    // Check if coupons already exist
    const existingCoupons = await Coupon.countDocuments();
    if (existingCoupons > 0) {
      logger.info('Coupons already exist, skipping coupon seeding');
      return;
    }

    // Get stores to create coupons for
    const stores = await Store.find({ active: true });
    if (stores.length === 0) {
      logger.warn('No stores found, skipping coupon seeding');
      return;
    }

    const coupons = [];

    // Create coupons for each store
    for (const store of stores) {
      const storeCoupons = [
        {
          storeId: store._id,
          title: `${store.name} - Flat ₹100 Off`,
          code: 'SAVE100',
          description: `Get flat ₹100 off on orders above ₹500 at ${store.name}`,
          discountType: 'fixed',
          discountValue: 100,
          minOrderValue: 500,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          isExclusive: false,
          category: 'General',
          terms: 'Valid on orders above ₹500. Cannot be combined with other offers.',
          priority: 1
        },
        {
          storeId: store._id,
          title: `${store.name} - 10% Off`,
          code: 'SAVE10',
          description: `Get 10% off on your order at ${store.name}`,
          discountType: 'percentage',
          discountValue: 10,
          minOrderValue: 300,
          maxDiscount: 200,
          expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
          isExclusive: false,
          category: 'General',
          terms: 'Valid on orders above ₹300. Maximum discount ₹200.',
          priority: 2
        },
        {
          storeId: store._id,
          title: `${store.name} - Free Shipping`,
          code: 'FREESHIP',
          description: `Get free shipping on your order at ${store.name}`,
          discountType: 'free_shipping',
          discountValue: 0,
          minOrderValue: 200,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          isExclusive: true,
          category: 'Shipping',
          terms: 'Valid on orders above ₹200. Free shipping to all locations.',
          priority: 3
        }
      ];

      coupons.push(...storeCoupons);
    }

    await Coupon.insertMany(coupons);
    logger.info(`Seeded ${coupons.length} coupons`);
  } catch (error) {
    logger.error('Error seeding coupons:', error);
    throw error;
  }
};

const seedReferrals = async (): Promise<void> => {
  try {
    logger.info('Seeding referrals...');

    // Check if referrals already exist
    const existingReferrals = await Referral.countDocuments();
    if (existingReferrals > 0) {
      logger.info('Referrals already exist, skipping referral seeding');
      return;
    }

    // Get users to create referrals for
    const users = await User.find({ role: 'user' });
    if (users.length < 2) {
      logger.warn('Not enough users found, skipping referral seeding');
      return;
    }

    const referrals = [
      {
        referrerId: users[0]._id,
        referredId: users[1]._id,
        rewardAmount: 50,
        rewardType: 'signup',
        status: 'approved'
      },
      {
        referrerId: users[0]._id,
        referredId: users[2]._id,
        rewardAmount: 50,
        rewardType: 'signup',
        status: 'pending'
      }
    ];

    await Referral.insertMany(referrals);
    logger.info(`Seeded ${referrals.length} referrals`);
  } catch (error) {
    logger.error('Error seeding referrals:', error);
    throw error;
  }
};

const main = async (): Promise<void> => {
  try {
    await connectDB();

    logger.info('Starting database seeding...');

    await seedUsers();
    await seedStores();
    await seedCoupons();
    await seedReferrals();

    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  main();
}

export { seedUsers, seedStores, seedCoupons, seedReferrals };