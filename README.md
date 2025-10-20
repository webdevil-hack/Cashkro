# CashKaro Clone

A complete clone of CashKaro.com with full functionality including cashback tracking, coupon management, store partnerships, and user wallet system.

## 🚀 Quick Start

Run the automated setup script:

```bash
./setup.sh
```

Or follow the manual setup below.

## ✨ Features

- 🏪 **Store Management**: Integration with 1000+ partner stores
- 🎫 **Coupon System**: Automated coupon validation and application
- 💰 **Cashback Tracking**: Real-time cashback calculation and tracking
- 👤 **User Management**: Complete user authentication and profile management
- 💳 **Wallet System**: Digital wallet for cashback storage and withdrawals
- 🔍 **Search & Filter**: Advanced search and filtering for deals and stores
- 📱 **Mobile Responsive**: Fully responsive design for all devices
- 🎯 **Referral System**: Multi-level referral program
- 📊 **Analytics**: Comprehensive analytics and reporting
- 🔐 **Admin Panel**: Complete admin dashboard for platform management

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom CashKaro theme
- **Shadcn/ui** - Modern UI components
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM with PostgreSQL
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Swagger** - API documentation

### Database & Infrastructure
- **PostgreSQL** - Primary database
- **Redis** - Caching layer
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

## 🚀 Installation

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd cashkaro-clone

# Run the setup script
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cashkaro-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

4. **Start database services**
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   cd ..
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs
- **Database**: postgresql://postgres:postgres@localhost:5432/cashkaro_clone
- **Redis**: redis://localhost:6379

## 👤 Test Accounts

- **Admin**: admin@cashkaro-clone.com / admin123
- **User**: user@test.com / user123

## 📁 Project Structure

```
cashkaro-clone/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # Base UI components
│   │   │   ├── layout/      # Layout components
│   │   │   └── home/        # Home page components
│   │   ├── lib/            # Utilities and configurations
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding
│   └── package.json
├── docker-compose.yml      # Docker services configuration
├── setup.sh               # Automated setup script
└── README.md
```

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users** - User accounts with wallet and referral system
- **Stores** - Partner stores with cashback rates
- **Coupons** - Discount codes and offers
- **Deals** - Special deals and promotions
- **Transactions** - Purchase tracking
- **Cashbacks** - Cashback records and payments
- **Withdrawals** - Cashback withdrawal requests

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Database
cd backend
npx prisma studio        # Open Prisma Studio
npx prisma db seed       # Seed database with sample data
npx prisma generate      # Generate Prisma client

# Production
npm run build           # Build frontend for production
npm start              # Start production server
```

## 📚 API Documentation

The complete API documentation is available at http://localhost:5000/api/docs when the backend server is running. It includes:

- Authentication endpoints
- Store management
- Coupon and deal APIs
- User management
- Transaction tracking
- Admin panel APIs

## 🎨 UI Components

The frontend uses a custom design system inspired by CashKaro with:

- Custom color palette (Orange primary, Blue secondary)
- Responsive design for all screen sizes
- Modern animations with Framer Motion
- Accessible UI components
- Loading states and error handling

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- SQL injection prevention with Prisma

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy to your preferred platform
```

### Database
- Use managed PostgreSQL (Railway, Supabase, etc.)
- Update DATABASE_URL in production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes only. Please respect the original CashKaro.com platform and use this code responsibly.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection error**
   - Ensure PostgreSQL is running: `docker-compose up -d postgres`
   - Check DATABASE_URL in backend/.env

2. **Frontend build errors**
   - Clear Next.js cache: `rm -rf frontend/.next`
   - Reinstall dependencies: `cd frontend && npm install`

3. **API not accessible**
   - Ensure backend is running on port 5000
   - Check CORS settings in backend

4. **Prisma issues**
   - Regenerate client: `npx prisma generate`
   - Reset database: `npx prisma db push --force-reset`

### Getting Help

- Check the API documentation at http://localhost:5000/api/docs
- Review the console logs for detailed error messages
- Ensure all environment variables are properly set

## 🎯 Roadmap

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Machine learning for personalized offers
- [ ] Multi-language support
- [ ] Social media integration