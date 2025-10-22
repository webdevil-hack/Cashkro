const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Store = require('../models/Store');
const Deal = require('../models/Deal');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Category = require('../models/Category');

dotenv.config({ path: '../.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Store.deleteMany();
    await Deal.deleteMany();
    await Coupon.deleteMany();
    await Category.deleteMany();

    console.log('Data cleared!');

    // Create admin user
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        isEmailVerified: true
      });
      console.log('Admin user created!');
    }

    // Create categories
    const categories = [
      { name: 'Fashion', slug: 'fashion', icon: '👗' },
      { name: 'Electronics', slug: 'electronics', icon: '📱' },
      { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
      { name: 'Beauty', slug: 'beauty', icon: '💄' },
      { name: 'Travel', slug: 'travel', icon: '✈️' },
      { name: 'Food & Dining', slug: 'food-dining', icon: '🍔' },
      { name: 'Health & Fitness', slug: 'health-fitness', icon: '💪' },
      { name: 'Books & Education', slug: 'books-education', icon: '📚' }
    ];

    await Category.insertMany(categories);
    console.log('Categories created!');

    // Create stores
    const stores = [
      {
        name: 'Amazon',
        slug: 'amazon',
        description: 'Shop for everything from electronics to fashion, home decor, and more with amazing cashback offers.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        website: 'https://www.amazon.in',
        categories: ['Fashion', 'Electronics', 'Home & Kitchen', 'Beauty', 'Books & Education'],
        cashbackType: 'upto',
        cashbackValue: 5,
        maxCashback: 500,
        isFeatured: true,
        rating: 4.5,
        popularity: 1000
      },
      {
        name: 'Flipkart',
        slug: 'flipkart',
        description: 'India\'s leading e-commerce platform offering great deals on electronics, fashion, home essentials and more.',
        logo: 'https://cdn.worldvectorlogo.com/logos/flipkart.svg',
        website: 'https://www.flipkart.com',
        categories: ['Fashion', 'Electronics', 'Home & Kitchen'],
        cashbackType: 'upto',
        cashbackValue: 7,
        maxCashback: 750,
        isFeatured: true,
        rating: 4.3,
        popularity: 950
      },
      {
        name: 'Myntra',
        slug: 'myntra',
        description: 'Your fashion destination for latest trends in clothing, footwear, and accessories.',
        logo: 'https://cdn.worldvectorlogo.com/logos/myntra.svg',
        website: 'https://www.myntra.com',
        categories: ['Fashion', 'Beauty'],
        cashbackType: 'percentage',
        cashbackValue: 8,
        isFeatured: true,
        rating: 4.4,
        popularity: 800
      },
      {
        name: 'MakeMyTrip',
        slug: 'makemytrip',
        description: 'Book flights, hotels, holiday packages, and more with cashback on every booking.',
        logo: 'https://cdn.worldvectorlogo.com/logos/makemytrip.svg',
        website: 'https://www.makemytrip.com',
        categories: ['Travel'],
        cashbackType: 'upto',
        cashbackValue: 10,
        maxCashback: 2000,
        isFeatured: true,
        rating: 4.2,
        popularity: 700
      },
      {
        name: 'Nykaa',
        slug: 'nykaa',
        description: 'Beauty and wellness destination with 100% authentic products and amazing cashback.',
        logo: 'https://cdn.worldvectorlogo.com/logos/nykaa-1.svg',
        website: 'https://www.nykaa.com',
        categories: ['Beauty', 'Health & Fitness'],
        cashbackType: 'percentage',
        cashbackValue: 6,
        isFeatured: true,
        rating: 4.6,
        popularity: 650
      },
      {
        name: 'Swiggy',
        slug: 'swiggy',
        description: 'Order food from your favorite restaurants with cashback on every order.',
        logo: 'https://cdn.worldvectorlogo.com/logos/swiggy-1.svg',
        website: 'https://www.swiggy.com',
        categories: ['Food & Dining'],
        cashbackType: 'percentage',
        cashbackValue: 4,
        isFeatured: false,
        rating: 4.1,
        popularity: 600
      },
      {
        name: 'Ajio',
        slug: 'ajio',
        description: 'Trendy fashion and lifestyle products with exclusive designs and great cashback.',
        logo: 'https://cdn.worldvectorlogo.com/logos/ajio.svg',
        website: 'https://www.ajio.com',
        categories: ['Fashion'],
        cashbackType: 'percentage',
        cashbackValue: 7,
        isFeatured: false,
        rating: 4.3,
        popularity: 550
      },
      {
        name: 'BookMyShow',
        slug: 'bookmyshow',
        description: 'Book movie tickets, events, and shows with cashback on every booking.',
        logo: 'https://cdn.worldvectorlogo.com/logos/bookmyshow.svg',
        website: 'https://www.bookmyshow.com',
        categories: ['Entertainment'],
        cashbackType: 'percentage',
        cashbackValue: 5,
        isFeatured: false,
        rating: 4.0,
        popularity: 500
      }
    ];

    const createdStores = await Store.insertMany(stores);
    console.log('Stores created!');

    // Create deals
    const deals = [
      {
        title: 'Big Billion Days Sale - Up to 80% Off',
        description: 'Mega sale on electronics, fashion, home decor and more. Limited time offer!',
        store: createdStores[1]._id,
        dealType: 'sale',
        discountType: 'percentage',
        discountValue: 'Up to 80%',
        isFeatured: true,
        categories: ['Electronics', 'Fashion'],
        affiliateLink: 'https://www.flipkart.com/big-billion-days'
      },
      {
        title: 'iPhone 15 Pro - Special Discount',
        description: 'Get the latest iPhone 15 Pro with bank offers and exchange bonuses.',
        store: createdStores[0]._id,
        dealType: 'deal',
        discountType: 'fixed',
        discountValue: '₹10,000 Off',
        originalPrice: 134900,
        salePrice: 124900,
        isFeatured: true,
        categories: ['Electronics'],
        affiliateLink: 'https://www.amazon.in/iphone-15-pro'
      },
      {
        title: 'End of Season Sale - Fashion Fiesta',
        description: 'Flat 60% off on all fashion items including clothing, footwear, and accessories.',
        store: createdStores[2]._id,
        dealType: 'sale',
        discountType: 'percentage',
        discountValue: 'Flat 60%',
        isFeatured: true,
        categories: ['Fashion'],
        affiliateLink: 'https://www.myntra.com/sale'
      },
      {
        title: 'Makeup Mega Sale',
        description: 'Buy 2 Get 1 Free on all makeup products from top brands.',
        store: createdStores[4]._id,
        dealType: 'offer',
        discountType: 'bogo',
        discountValue: 'Buy 2 Get 1 Free',
        isFeatured: false,
        categories: ['Beauty'],
        affiliateLink: 'https://www.nykaa.com/offers'
      }
    ];

    await Deal.insertMany(deals);
    console.log('Deals created!');

    // Create coupons
    const coupons = [
      {
        title: 'Flat ₹200 Off on First Order',
        code: 'FIRST200',
        description: 'Get flat ₹200 discount on your first order. Minimum order value ₹500.',
        store: createdStores[5]._id,
        discountType: 'fixed',
        discountValue: '₹200',
        minOrderValue: 500,
        isExclusive: true,
        isVerified: true,
        categories: ['Food & Dining'],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: '20% Off on Fashion',
        code: 'FASHION20',
        description: 'Get 20% off on all fashion items. Maximum discount ₹1000.',
        store: createdStores[2]._id,
        discountType: 'percentage',
        discountValue: '20%',
        maxDiscount: 1000,
        minOrderValue: 1500,
        isVerified: true,
        categories: ['Fashion'],
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Free Shipping on All Orders',
        code: 'FREESHIP',
        description: 'Get free shipping on all orders above ₹499.',
        store: createdStores[0]._id,
        discountType: 'freeShipping',
        discountValue: 'Free Shipping',
        minOrderValue: 499,
        isVerified: true,
        categories: ['All Categories'],
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        title: '₹500 Off on Flight Bookings',
        code: 'FLY500',
        description: 'Save ₹500 on domestic flight bookings. Minimum booking value ₹3000.',
        store: createdStores[3]._id,
        discountType: 'fixed',
        discountValue: '₹500',
        minOrderValue: 3000,
        isExclusive: true,
        isVerified: true,
        categories: ['Travel'],
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      }
    ];

    await Coupon.insertMany(coupons);
    console.log('Coupons created!');

    console.log('All data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
