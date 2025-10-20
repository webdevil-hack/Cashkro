#!/bin/bash

echo "🚀 Setting up CashKaro Clone..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files
echo "📝 Creating environment files..."

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from example"
else
    echo "⚠️  backend/.env already exists"
fi

# Frontend .env.local
if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local from example"
else
    echo "⚠️  frontend/.env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."

# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully!"

# Start services with Docker Compose
echo "🐳 Starting services with Docker Compose..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Generate Prisma client and run migrations
echo "🗄️  Setting up database..."
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
cd ..

echo "🎉 Setup completed successfully!"
echo ""
echo "🌐 Services:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:5000"
echo "  - API Documentation: http://localhost:5000/api/docs"
echo "  - Database: postgresql://postgres:postgres@localhost:5432/cashkaro_clone"
echo "  - Redis: redis://localhost:6379"
echo ""
echo "👤 Test Accounts:"
echo "  - Admin: admin@cashkaro-clone.com / admin123"
echo "  - User: user@test.com / user123"
echo ""
echo "🚀 To start the development servers:"
echo "  npm run dev"
echo ""
echo "📚 To view API documentation:"
echo "  Open http://localhost:5000/api/docs in your browser"