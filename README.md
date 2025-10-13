# CashKaro Clone - Full-Stack Cashback & Coupons Platform

A production-ready, full-stack cashback and coupons website built with modern technologies. This project replicates the core functionality of CashKaro with affiliate tracking, user management, and real-time cashback processing.

## 🚀 Features

### Core Features
- **Cashback Tracking**: Real-time affiliate click tracking and conversion monitoring
- **Store Management**: 500+ partner stores with dynamic cashback rates
- **Coupon System**: Exclusive coupons with usage tracking and expiration
- **User Dashboard**: Complete user profile with wallet management
- **Referral System**: Multi-level referral rewards and tracking
- **Admin Panel**: Comprehensive admin dashboard for store and user management
- **Payment Integration**: Razorpay integration for payouts
- **Real-time Notifications**: WebSocket-based real-time updates

### Technical Features
- **Progressive Web App (PWA)**: Offline support and mobile app-like experience
- **SEO Optimized**: Server-side rendering with Next.js
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database Optimization**: MongoDB with proper indexing
- **Caching**: Redis for session management and performance
- **Security**: JWT authentication, rate limiting, and data validation
- **Monitoring**: Comprehensive logging and error tracking

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Query
- **UI Components**: Radix UI + Custom Components
- **PWA**: Next-PWA

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT + OAuth (Google, Facebook)
- **Payments**: Razorpay, Stripe
- **File Upload**: Multer
- **Validation**: Joi
- **Logging**: Winston

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend), Render/AWS (Backend)
- **Monitoring**: Built-in health checks
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
cashkaro-clone/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions and API client
│   ├── styles/              # Global styles and Tailwind config
│   └── public/              # Static assets
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── scripts/         # Database seeds and migrations
│   └── tests/               # Backend tests
├── infra/                   # Infrastructure configuration
│   ├── docker-compose.yml   # Local development setup
│   ├── nginx.conf           # Nginx configuration
│   └── mongo-init.js        # Database initialization
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cashkaro-clone.git
cd cashkaro-clone
```

### 2. Environment Setup
```bash
# Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Edit environment variables
nano .env
```

### 3. Start with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Manual Setup (Alternative)
```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Start MongoDB and Redis
# (Install and start MongoDB and Redis locally)

# Seed the database
cd backend && npm run seed

# Start development servers
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017/cashkaro
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Payments
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Affiliate Networks
ADMITAD_API_KEY=your-admitad-api-key
CUELINKS_API_KEY=your-cuelinks-api-key
IMPACT_API_KEY=your-impact-api-key
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Database Schema

### Core Models
- **User**: User profiles, wallets, referral tracking
- **Store**: Partner stores with affiliate links and cashback rates
- **Coupon**: Store coupons with usage tracking
- **Click**: Affiliate click tracking and conversion monitoring
- **Transaction**: Cashback transactions and payout management
- **Referral**: Referral rewards and tracking

### Key Indexes
- User email (unique)
- Store slug (unique)
- Click token (unique, TTL)
- Transaction user/status composite
- Referral referrer/referred composite

## 🔄 Affiliate Tracking Flow

1. **User Clicks**: User clicks "Shop Now" on store/coupon
2. **Click Creation**: Backend creates click record with unique token
3. **Redirect**: User redirected to affiliate URL with tracking parameters
4. **Conversion**: Affiliate network reports conversion via webhook
5. **Transaction**: System creates pending transaction
6. **Approval**: Admin approves transaction, credits user wallet
7. **Payout**: User can withdraw approved cashback

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/AWS)
1. Build Docker image
2. Deploy to container service
3. Configure environment variables
4. Set up MongoDB and Redis instances

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure network access
3. Update MONGO_URI in environment

### Cache (Redis Cloud)
1. Create Redis Cloud instance
2. Configure connection string
3. Update REDIS_URL in environment

## 📈 Performance Optimization

### Frontend
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Caching**: Service worker for offline support
- **Bundle Analysis**: Webpack bundle analyzer

### Backend
- **Database Indexing**: Optimized queries with proper indexes
- **Redis Caching**: Session and frequently accessed data
- **Connection Pooling**: MongoDB connection optimization
- **Rate Limiting**: API protection and resource management

## 🔒 Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Data Validation**: Joi schema validation
- **Rate Limiting**: API endpoint protection
- **CORS**: Cross-origin request security
- **Helmet**: Security headers
- **Input Sanitization**: XSS protection

## 📱 PWA Features

- **Offline Support**: Service worker caching
- **App-like Experience**: Full-screen mode
- **Push Notifications**: Real-time updates
- **Install Prompt**: Native app installation
- **Background Sync**: Offline data synchronization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commits
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- CashKaro for inspiration
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- MongoDB for the flexible database
- All open-source contributors

## 📞 Support

For support, email support@cashkaro-clone.com or join our Discord community.

## 🔗 Links

- **Live Demo**: https://cashkaro-clone.vercel.app
- **API Documentation**: https://api.cashkaro-clone.com/docs
- **GitHub Repository**: https://github.com/yourusername/cashkaro-clone
- **Issue Tracker**: https://github.com/yourusername/cashkaro-clone/issues

---

**Built with ❤️ by the CashKaro Clone Team**