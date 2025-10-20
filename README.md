# CashKaro Clone - Complete Cashback & Coupons Platform

A full-stack clone of CashKaro.com with all functionality including cashback tracking, deals, coupons, user authentication, and more.

## 🚀 Features

### User Features
- **User Authentication**: Complete registration and login system with JWT
- **Store Browsing**: Browse 1500+ stores with filtering and search
- **Cashback Tracking**: Track cashback on purchases from partner stores
- **Deals & Offers**: Browse and access hot deals and offers
- **Coupons**: Access and copy exclusive coupon codes
- **User Dashboard**: View cashback history, earnings, and statistics
- **Referral System**: Invite friends and earn referral bonuses
- **Withdrawal System**: Withdraw confirmed cashback to bank account

### Admin Features
- **Store Management**: Add, edit, and manage stores
- **Deal Management**: Create and manage deals and offers
- **Coupon Management**: Add and manage coupon codes
- **Cashback Management**: Track and confirm cashback transactions
- **User Management**: View and manage user accounts

### Technical Features
- **Modern UI**: Beautiful, responsive design similar to CashKaro.com
- **RESTful API**: Complete backend API with proper authentication
- **Database**: MongoDB with Mongoose ODM
- **State Management**: Zustand for efficient state management
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling
- **Security**: JWT authentication, rate limiting, helmet security headers

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls
- **React Hot Toast** for notifications
- **React Icons** for icons
- **date-fns** for date formatting

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for validation
- **cors** for cross-origin requests
- **helmet** for security headers
- **morgan** for logging
- **express-rate-limit** for rate limiting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cashkaro-clone
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your MongoDB URI and other configurations

# Seed the database with sample data
node scripts/seedData.js

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Run Both Servers (Alternative)

From the root directory:
```bash
# Install all dependencies
npm run install-all

# Run both frontend and backend concurrently
npm run dev
```

## 🔑 Default Credentials

### Admin Account
- **Email**: admin@cashkaro.com
- **Password**: admin123

You can create additional user accounts through the registration page.

## 📁 Project Structure

```
cashkaro-clone/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/               # Route controllers
│   │   ├── authController.js
│   │   ├── storeController.js
│   │   ├── dealController.js
│   │   ├── couponController.js
│   │   └── cashbackController.js
│   ├── middleware/                # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/                    # Mongoose models
│   │   ├── User.js
│   │   ├── Store.js
│   │   ├── Deal.js
│   │   ├── Coupon.js
│   │   ├── Cashback.js
│   │   ├── Withdrawal.js
│   │   └── Category.js
│   ├── routes/                    # API routes
│   │   ├── auth.js
│   │   ├── stores.js
│   │   ├── deals.js
│   │   ├── coupons.js
│   │   └── cashback.js
│   ├── scripts/
│   │   └── seedData.js           # Database seeder
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── server.js                 # Main server file
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts          # API configuration
│   │   ├── components/           # React components
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── StoreCard.tsx
│   │   │   ├── DealCard.tsx
│   │   │   ├── CouponCard.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/                # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Stores.tsx
│   │   │   ├── StoreDetails.tsx
│   │   │   ├── Deals.tsx
│   │   │   ├── Coupons.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── MyCashback.tsx
│   │   ├── store/                # State management
│   │   │   └── authStore.ts
│   │   ├── types/                # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── package.json                  # Root package.json
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Update password

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get single store
- `POST /api/stores/:id/click` - Track store click
- `POST /api/stores` - Create store (Admin)
- `PUT /api/stores/:id` - Update store (Admin)
- `DELETE /api/stores/:id` - Delete store (Admin)

### Deals
- `GET /api/deals` - Get all deals
- `GET /api/deals/:id` - Get single deal
- `POST /api/deals/:id/click` - Track deal click
- `POST /api/deals` - Create deal (Admin)
- `PUT /api/deals/:id` - Update deal (Admin)
- `DELETE /api/deals/:id` - Delete deal (Admin)

### Coupons
- `GET /api/coupons` - Get all coupons
- `GET /api/coupons/:id` - Get single coupon
- `POST /api/coupons/:id/use` - Track coupon use
- `POST /api/coupons` - Create coupon (Admin)
- `PUT /api/coupons/:id` - Update coupon (Admin)
- `DELETE /api/coupons/:id` - Delete coupon (Admin)

### Cashback
- `GET /api/cashback/my-cashback` - Get user cashback
- `GET /api/cashback/withdrawals` - Get withdrawals
- `POST /api/cashback/withdraw` - Request withdrawal
- `PUT /api/cashback/:id/status` - Update cashback status (Admin)

## 🎨 UI/UX Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Interface**: Clean and intuitive design similar to CashKaro.com
- **Loading States**: Smooth loading animations
- **Toast Notifications**: User-friendly notifications for actions
- **Form Validation**: Real-time validation feedback
- **Protected Routes**: Secure access to authenticated pages
- **Search & Filters**: Advanced filtering and search functionality
- **Sticky Header**: Navigation always accessible
- **Category Browsing**: Easy category-based navigation

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- HTTP security headers with Helmet
- CORS configuration
- Rate limiting on API endpoints
- Input validation and sanitization
- Protected routes on frontend
- Secure token storage

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB on cloud (MongoDB Atlas)
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting
3. Update API URL in production

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
ADMIN_EMAIL=admin@cashkaro.com
ADMIN_PASSWORD=admin123
```

## 🤝 Contributing

This is a clone project for educational purposes. Feel free to fork and modify for your own use.

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Inspired by CashKaro.com
- Built with modern web technologies
- Designed for learning and demonstration purposes

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Note**: This is a clone project created for educational purposes. It is not affiliated with or endorsed by CashKaro.com.
