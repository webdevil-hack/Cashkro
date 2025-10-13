#!/bin/bash

# CashKaro Clone Setup Script
echo "🚀 Setting up CashKaro Clone..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example"
    cp .env.example .env
    echo "⚠️  Please update .env file with your actual configuration values"
fi

# Install dependencies
echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed"

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d mongodb redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations and seeds
echo "🌱 Seeding database..."
cd backend
npm run seed
cd ..

echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "To start with Docker:"
echo "  docker-compose up"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:4000"
echo "MongoDB: mongodb://localhost:27017"
echo "Redis: redis://localhost:6379"
echo ""
echo "Admin credentials:"
echo "  Email: admin@cashkaro-clone.com"
echo "  Password: admin123"