import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { Store } from '../models/Store';
import { Category } from '../models/Category';
import { Offer, OfferType } from '../models/Offer';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

async function seed() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    // Create categories
    const categories = [
      { name: 'Fashion', icon: 'fashion', priority: 1 },
      { name: 'Electronics', icon: 'electronics', priority: 2 },
      { name: 'Travel', icon: 'travel', priority: 3 },
      { name: 'Food & Dining', icon: 'food', priority: 4 },
      { name: 'Grocery', icon: 'grocery', priority: 5 },
      { name: 'Health & Beauty', icon: 'health', priority: 6 },
      { name: 'Books & Education', icon: 'education', priority: 7 },
      { name: 'Gaming', icon: 'gaming', priority: 8 },
    ];

    const categoryRepo = AppDataSource.getRepository(Category);
    const savedCategories: Category[] = [];

    for (const catData of categories) {
      const category = categoryRepo.create({
        name: catData.name,
        slug: slugify(catData.name, { lower: true }),
        icon: catData.icon,
        priority: catData.priority,
        isActive: true,
      });
      savedCategories.push(await categoryRepo.save(category));
    }

    console.log('Categories created');

    // Create admin user
    const userRepo = AppDataSource.getRepository(User);
    const adminPassword = await bcrypt.hash('Admin@123456', 10);
    
    const adminUser = userRepo.create({
      email: 'admin@cashkaro-clone.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      emailVerified: true,
      referralCode: 'ADMIN001',
    });
    await userRepo.save(adminUser);

    console.log('Admin user created');

    // Create sample stores
    const stores = [
      {
        name: 'Amazon',
        description: 'Shop from millions of products with cashback',
        cashbackRate: 5,
        categories: [savedCategories[0], savedCategories[1]],
        isFeatured: true,
        isPopular: true,
      },
      {
        name: 'Flipkart',
        description: 'India\'s leading e-commerce platform',
        cashbackRate: 7,
        categories: [savedCategories[0], savedCategories[1], savedCategories[4]],
        isFeatured: true,
        isPopular: true,
      },
      {
        name: 'Myntra',
        description: 'Fashion and lifestyle destination',
        cashbackRate: 10,
        categories: [savedCategories[0]],
        isFeatured: true,
      },
      {
        name: 'MakeMyTrip',
        description: 'Book flights, hotels, and holidays',
        cashbackRate: 8,
        categories: [savedCategories[2]],
        isPopular: true,
      },
      {
        name: 'Swiggy',
        description: 'Order food online from restaurants',
        cashbackRate: 4,
        categories: [savedCategories[3]],
        isNew: true,
      },
      {
        name: 'Zomato',
        description: 'Food delivery and dining',
        cashbackRate: 5,
        categories: [savedCategories[3]],
      },
      {
        name: 'BigBasket',
        description: 'Online grocery shopping',
        cashbackRate: 3,
        categories: [savedCategories[4]],
      },
      {
        name: 'Nykaa',
        description: 'Beauty and wellness products',
        cashbackRate: 9,
        categories: [savedCategories[5]],
        isFeatured: true,
      },
    ];

    const storeRepo = AppDataSource.getRepository(Store);
    const savedStores: Store[] = [];

    for (const storeData of stores) {
      const store = storeRepo.create({
        name: storeData.name,
        slug: slugify(storeData.name, { lower: true }),
        description: storeData.description,
        cashbackRate: storeData.cashbackRate,
        affiliateUrl: `https://affiliate.example.com/${slugify(storeData.name, { lower: true })}`,
        categories: storeData.categories,
        isFeatured: storeData.isFeatured || false,
        isPopular: storeData.isPopular || false,
        isNew: storeData.isNew || false,
        cashbackRates: {
          default: storeData.cashbackRate,
          categories: {},
        },
        metadata: {
          affiliateNetwork: 'example',
          merchantId: `merchant_${slugify(storeData.name, { lower: true })}`,
          programId: `program_${Math.random().toString(36).substr(2, 9)}`,
          deepLinkEnabled: true,
          cookieDuration: 30,
          averageApprovalTime: 45,
        },
      });
      savedStores.push(await storeRepo.save(store));
    }

    console.log('Stores created');

    // Create sample offers
    const offerRepo = AppDataSource.getRepository(Offer);
    
    for (const store of savedStores) {
      const offers = [
        {
          title: `Flat ${store.cashbackRate + 2}% Extra Cashback`,
          description: `Get additional cashback on all products`,
          type: OfferType.CASHBACK,
          discount: store.cashbackRate + 2,
          discountType: 'percentage',
          isExclusive: true,
          isVerified: true,
        },
        {
          title: 'Free Shipping on Orders Above ₹499',
          description: 'No delivery charges on orders above ₹499',
          type: OfferType.DEAL,
          isVerified: true,
        },
      ];

      if (Math.random() > 0.5) {
        offers.push({
          title: 'Get 20% OFF',
          description: 'Maximum discount ₹500',
          type: OfferType.COUPON,
          code: `${store.name.toUpperCase()}20`,
          discount: 20,
          discountType: 'percentage',
          maximumDiscount: 500,
          minimumPurchase: 1000,
          isVerified: true,
        });
      }

      for (const offerData of offers) {
        const offer = offerRepo.create({
          ...offerData,
          storeId: store.id,
          validFrom: new Date(),
          validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
        await offerRepo.save(offer);
      }
    }

    console.log('Offers created');

    // Create test user
    const testPassword = await bcrypt.hash('Test@123456', 10);
    const testUser = userRepo.create({
      email: 'test@example.com',
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      emailVerified: true,
      referralCode: 'TEST001',
      walletBalance: 500,
      availableCashback: 500,
      totalEarnings: 1500,
      pendingCashback: 200,
    });
    await userRepo.save(testUser);

    console.log('Test user created');

    console.log('Seeding completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@cashkaro-clone.com / Admin@123456');
    console.log('User: test@example.com / Test@123456');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seed();