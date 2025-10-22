#!/bin/bash

echo "🔧 FIXING DEPLOYMENT ISSUES - CashKaro Clone"
echo "============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Checking current status...${NC}"

# Check if we're in the right directory
if [ ! -d "client" ]; then
    echo -e "${RED}❌ Error: client directory not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${GREEN}✅ Found client directory${NC}"

# Go to client directory
cd client

echo -e "${BLUE}🔧 Fixing dependencies...${NC}"

# Remove node_modules and package-lock.json
echo "Cleaning up old dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    echo "Trying alternative approach..."
    
    # Install specific packages that might be missing
    npm install @tanstack/react-query react-hot-toast framer-motion lucide-react clsx tailwind-merge date-fns
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

echo -e "${BLUE}🔧 Fixing TypeScript issues...${NC}"

# Install TypeScript dependencies
npm install --save-dev @types/node @types/react @types/react-dom

echo -e "${GREEN}✅ TypeScript dependencies installed${NC}"

echo -e "${BLUE}🔧 Fixing Tailwind CSS...${NC}"

# Install Tailwind dependencies
npm install tailwindcss autoprefixer postcss

echo -e "${GREEN}✅ Tailwind CSS dependencies installed${NC}"

echo -e "${BLUE}🔧 Testing build...${NC}"

# Test build
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    echo -e "${YELLOW}🚀 Ready to deploy!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com/new"
    echo "2. Connect: webdevil-hack/Cashkro"
    echo "3. Set Root Directory: client"
    echo "4. Click Deploy"
    echo "5. Add environment variable: NEXT_PUBLIC_API_URL"
    echo ""
    echo -e "${GREEN}Your app will be live in minutes! 🚀${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    echo ""
    echo "Common fixes:"
    echo "1. Check for missing dependencies"
    echo "2. Fix TypeScript errors"
    echo "3. Fix CSS/Tailwind issues"
    echo ""
    echo "Run: npm run build to see specific errors"
    echo "Then check DEPLOYMENT_ERRORS_FIX.md for solutions"
fi

echo ""
echo -e "${BLUE}📚 For more help, see:${NC}"
echo "• DEPLOYMENT_ERRORS_FIX.md - Detailed error solutions"
echo "• VERCEL_DEPLOY_NOW.md - Step-by-step deployment"
echo "• DEPLOY_NOW.md - Complete deployment guide"