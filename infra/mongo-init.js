// MongoDB initialization script
db = db.getSiblingDB('cashkaro');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'passwordHash', 'role'],
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
        passwordHash: { bsonType: 'string' },
        role: { enum: ['user', 'admin'] },
        wallet: {
          bsonType: 'object',
          properties: {
            available: { bsonType: 'number', minimum: 0 },
            pending: { bsonType: 'number', minimum: 0 }
          }
        }
      }
    }
  }
});

db.createCollection('stores', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'slug', 'currentCashbackPercent', 'active'],
      properties: {
        name: { bsonType: 'string' },
        slug: { bsonType: 'string' },
        currentCashbackPercent: { bsonType: 'number', minimum: 0, maximum: 100 },
        active: { bsonType: 'bool' }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ referralCode: 1 }, { unique: true, sparse: true });
db.users.createIndex({ createdAt: -1 });

db.stores.createIndex({ slug: 1 }, { unique: true });
db.stores.createIndex({ name: 1 });
db.stores.createIndex({ categories: 1 });
db.stores.createIndex({ active: 1 });

db.coupons.createIndex({ storeId: 1 });
db.coupons.createIndex({ expiryDate: 1 });
db.coupons.createIndex({ isExclusive: 1 });

db.clicks.createIndex({ clickToken: 1 }, { unique: true });
db.clicks.createIndex({ userId: 1 });
db.clicks.createIndex({ storeId: 1 });
db.clicks.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

db.transactions.createIndex({ userId: 1 });
db.transactions.createIndex({ storeId: 1 });
db.transactions.createIndex({ status: 1 });
db.transactions.createIndex({ createdAt: -1 });

db.referrals.createIndex({ referrerId: 1 });
db.referrals.createIndex({ referredId: 1 });
db.referrals.createIndex({ status: 1 });

// Create admin user
db.users.insertOne({
  name: 'Admin User',
  email: 'admin@cashkaro-clone.com',
  passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKz2G', // admin123
  role: 'admin',
  wallet: { available: 0, pending: 0 },
  referralCode: 'ADMIN001',
  isBlocked: false,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully!');