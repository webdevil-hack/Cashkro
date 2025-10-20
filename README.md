# CashKaro Clone - Complete E-commerce Cashback Platform

A comprehensive clone of CashKaro.com built with modern technologies, featuring a full-stack architecture with Next.js frontend and Node.js backend.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Complete signup/login system with JWT
- **Merchant Management** - Add, edit, and manage merchant partners
- **Deal Management** - Create and manage cashback deals and coupons
- **Transaction Tracking** - Track user purchases and cashback earnings
- **Wallet System** - Digital wallet for cashback management
- **Referral System** - User referral program with rewards
- **Admin Dashboard** - Complete admin panel for platform management

### User Features
- **Cashback Earning** - Earn cashback on purchases from partner merchants
- **Deal Discovery** - Browse and search through thousands of deals
- **Wallet Management** - Track earnings and withdraw to bank account
- **Transaction History** - Complete purchase and cashback history
- **Referral Program** - Earn by referring friends
- **Mobile Responsive** - Optimized for all devices

### Admin Features
- **Merchant Management** - Add/edit merchants and their details
- **Deal Management** - Create and manage promotional deals
- **User Management** - View and manage user accounts
- **Transaction Monitoring** - Track all platform transactions
- **Analytics Dashboard** - Platform statistics and insights
- **Content Management** - Manage featured deals and categories

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Framer Motion** - Animations
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email services

### Additional Tools
- **Stripe** - Payment processing
- **Cloudinary** - Image management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Concurrently** - Development scripts

## 📁 Project Structure

```
cashkaro-clone/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utility functions
│   └── public/           # Static assets
├── server/               # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── index.js          # Server entry point
└── package.json          # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cashkaro-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   
   # Update server/.env with your configuration
   MONGODB_URI=mongodb://localhost:27017/cashkaro
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   # ... other environment variables
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Database Setup

The application will automatically create the necessary collections when you start the server. Make sure MongoDB is running on your system.

## 📱 Pages & Features

### Public Pages
- **Homepage** - Hero section, featured deals, popular merchants
- **Deals** - Browse all available deals and offers
- **Merchants** - View all partner merchants
- **Categories** - Browse deals by category
- **How It Works** - Platform explanation
- **Login/Register** - User authentication

### User Dashboard
- **Dashboard** - Overview of earnings and recent activity
- **Wallet** - Cashback balance and withdrawal options
- **Transactions** - Complete purchase history
- **Profile** - User account management
- **Referrals** - Referral program and earnings

### Admin Panel
- **Dashboard** - Platform statistics and analytics
- **Merchants** - Manage merchant partners
- **Deals** - Create and manage deals
- **Users** - User account management
- **Transactions** - Monitor all transactions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Merchants
- `GET /api/merchants` - Get all merchants
- `GET /api/merchants/:id` - Get merchant details
- `POST /api/merchants` - Create merchant (Admin)
- `PUT /api/merchants/:id` - Update merchant (Admin)

### Deals
- `GET /api/deals` - Get all deals
- `GET /api/deals/:id` - Get deal details
- `POST /api/deals` - Create deal (Admin)
- `PUT /api/deals/:id` - Update deal (Admin)

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get transaction details

### Cashback
- `GET /api/cashback` - Get user cashback
- `GET /api/cashback/summary` - Get cashback summary
- `POST /api/cashback/withdraw` - Request withdrawal

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Mobile-first design
- **Dark/Light Mode** - Theme switching capability
- **Animations** - Smooth transitions and micro-interactions
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Accessibility** - WCAG compliant components

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **Input Validation** - Server-side validation
- **Rate Limiting** - API rate limiting
- **CORS Protection** - Cross-origin security
- **Helmet.js** - Security headers

## 📊 Database Schema

### Collections
- **Users** - User accounts and profiles
- **Merchants** - Partner merchant information
- **Deals** - Cashback deals and offers
- **Transactions** - Purchase and cashback records
- **Cashback** - Cashback earnings and payouts

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Connect your repository
2. Set environment variables
3. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- CashKaro.com for inspiration
- All open-source contributors
- The React and Node.js communities

## 📞 Support

For support, email support@cashkaro-clone.com or create an issue in the repository.

---

**Note**: This is a clone project for educational purposes. All trademarks and brand names belong to their respective owners.