# CashKaro Clone - Full Stack Cashback Platform

A comprehensive clone of CashKaro.com built with modern technologies, featuring a complete cashback and coupon system with user authentication, store management, and affiliate tracking.

## Features

- 🛍️ **Store Management**: Browse and search through 1500+ partner stores
- 💰 **Cashback System**: Automatic cashback tracking and management
- 🎟️ **Coupons & Offers**: Active coupon codes and exclusive deals
- 👤 **User Authentication**: Email/password and social login (Google, Facebook)
- 💳 **Wallet System**: Track earnings and request withdrawals
- 🎁 **Referral Program**: Earn bonuses by referring friends
- 📱 **Responsive Design**: Mobile-friendly interface
- 🔒 **Secure**: JWT authentication, rate limiting, and data validation
- 📊 **Admin Panel**: Manage stores, users, and cashback transactions

## Tech Stack

### Backend
- Node.js with Express.js and TypeScript
- PostgreSQL with TypeORM
- Redis for caching and session management
- JWT for authentication
- Passport.js for OAuth integration
- Nodemailer for email notifications

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- Material-UI (MUI) for UI components
- React Query for data fetching
- React Router v6 for navigation
- React Hook Form for form handling

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cashkaro-clone
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install --legacy-peer-deps
```

4. Set up environment variables:

Backend (.env):
```bash
cd ../backend
cp .env.example .env
# Edit .env with your configuration
```

Frontend (.env):
```bash
cd ../frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

5. Set up the database:
```bash
# Create a PostgreSQL database named 'cashkaro_clone'
createdb cashkaro_clone

# Run migrations (from backend directory)
cd ../backend
npm run migrate
```

6. Seed the database with sample data (optional):
```bash
npm run seed
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Production Mode

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd ../backend
npm run build
```

3. Start the production server:
```bash
NODE_ENV=production npm start
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Store Endpoints
- `GET /api/stores` - List all stores with filters
- `GET /api/stores/featured` - Get featured stores
- `GET /api/stores/popular` - Get popular stores
- `GET /api/stores/:slug` - Get store details
- `POST /api/stores/:storeId/visit` - Track store visit

### Cashback Endpoints
- `GET /api/cashback/summary` - Get user's cashback summary
- `GET /api/cashback/transactions` - List cashback transactions
- `POST /api/cashback/track` - Track a purchase (webhook)

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/withdrawals` - Withdrawal history
- `POST /api/user/withdraw` - Create withdrawal request

## Project Structure

```
cashkaro-clone/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # TypeORM entities
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Key Features Implementation

### Cashback Tracking
- Automatic tracking through affiliate links
- Click tracking with unique IDs
- Purchase confirmation webhooks
- Cashback status management (pending, confirmed, paid)

### User Wallet
- Real-time balance updates
- Withdrawal requests
- Transaction history
- Multiple payment methods support

### Store Management
- Categories and filtering
- Search functionality
- Featured and popular stores
- Dynamic cashback rates

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- XSS protection

## Deployment

### Using Docker

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

### Manual Deployment

1. Set up PostgreSQL and Redis on your server
2. Configure environment variables
3. Build both frontend and backend
4. Use PM2 or similar for process management
5. Set up Nginx as reverse proxy

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by CashKaro.com
- Built for educational purposes
- Uses open-source libraries and frameworks