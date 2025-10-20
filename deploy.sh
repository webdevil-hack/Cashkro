#!/bin/bash

echo "🚀 CashKaro Clone - Deployment Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_status "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - CashKaro Clone"
    print_success "Git repository initialized"
fi

# Check if user is logged into git
if ! git config user.name > /dev/null 2>&1; then
    print_warning "Git user not configured. Please set up git first:"
    echo "git config --global user.name 'Your Name'"
    echo "git config --global user.email 'your.email@example.com'"
    exit 1
fi

# Check if remote origin is set
if ! git remote get-url origin > /dev/null 2>&1; then
    print_warning "No remote origin set. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/your-repo.git"
    echo "git push -u origin main"
    exit 1
fi

print_status "Checking deployment prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm $(npm -v) detected"

# Install dependencies
print_status "Installing dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed successfully"

# Check if environment files exist
if [ ! -f "server/.env" ]; then
    print_warning "server/.env not found. Creating from template..."
    cp server/.env.example server/.env
    print_warning "Please update server/.env with your production values"
fi

if [ ! -f "client/.env.local" ]; then
    print_warning "client/.env.local not found. Creating template..."
    cat > client/.env.local << EOF
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app/api
EOF
    print_warning "Please update client/.env.local with your production API URL"
fi

# Build the application
print_status "Building the application..."
cd client
npm run build

if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

cd ..
print_success "Application built successfully"

# Commit and push changes
print_status "Committing and pushing changes..."
git add .
git commit -m "Deploy: Production build $(date)"
git push origin main

if [ $? -ne 0 ]; then
    print_error "Failed to push to GitHub"
    exit 1
fi

print_success "Code pushed to GitHub successfully"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up MongoDB Atlas:"
echo "   - Go to https://cloud.mongodb.com"
echo "   - Create a free cluster"
echo "   - Get your connection string"
echo ""
echo "2. Deploy Backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Select the 'server' folder"
echo "   - Set environment variables"
echo ""
echo "3. Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Connect your GitHub repository"
echo "   - Select the 'client' folder"
echo "   - Set environment variables"
echo ""
echo "4. Update environment variables:"
echo "   - Backend: MONGODB_URI, JWT_SECRET, CLIENT_URL"
echo "   - Frontend: NEXT_PUBLIC_API_URL"
echo ""
echo "📚 For detailed instructions, see deploy.md"
echo ""
print_success "Happy deploying! 🚀"