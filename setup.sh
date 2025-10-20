#!/bin/bash

echo "🚀 Setting up CashKaro Clone..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB 6+ first."
    echo "   You can download it from: https://www.mongodb.com/try/download/community"
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..

echo "🔧 Setting up environment files..."

# Create server environment file
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env file"
    echo "⚠️  Please update server/.env with your configuration"
else
    echo "✅ server/.env already exists"
fi

# Create client environment file
if [ ! -f client/.env.local ]; then
    cat > client/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
    echo "✅ Created client/.env.local file"
else
    echo "✅ client/.env.local already exists"
fi

echo "🗄️  Setting up database..."

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running. Please start MongoDB before running the application."
    echo "   You can start it with: mongod"
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Run 'npm run dev' to start the development servers"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 For more information, check the README.md file"