#!/bin/bash

echo "🚀 Making CashKaro Clone LIVE!"
echo "==============================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Your GitHub repository: webdevil-hack/Cashkro${NC}"
echo -e "${BLUE}Branch: cursor/clone-cashkaro-com-platform-with-full-functionality-0d28${NC}"
echo ""

echo -e "${YELLOW}🚀 STEP 1: Deploy Backend to Railway${NC}"
echo "1. Go to: https://railway.app"
echo "2. Sign up with GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select: webdevil-hack/Cashkro"
echo "5. Set Root Directory: server"
echo "6. Add these environment variables:"
echo "   NODE_ENV=production"
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cashkaro"
echo "   JWT_SECRET=your_super_secret_jwt_key_here"
echo "   CLIENT_URL=https://your-frontend.vercel.app"
echo "   PORT=5000"
echo ""

echo -e "${YELLOW}🚀 STEP 2: Deploy Frontend to Vercel${NC}"
echo "1. Go to: https://vercel.com"
echo "2. Sign up with GitHub"
echo "3. Click 'New Project' → Import from GitHub"
echo "4. Select: webdevil-hack/Cashkro"
echo "5. Set Root Directory: client"
echo "6. Add environment variable:"
echo "   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api"
echo ""

echo -e "${YELLOW}🚀 STEP 3: Set up MongoDB Atlas${NC}"
echo "1. Go to: https://cloud.mongodb.com"
echo "2. Create free cluster"
echo "3. Create database user"
echo "4. Whitelist IP: 0.0.0.0/0"
echo "5. Get connection string"
echo "6. Update MONGODB_URI in Railway"
echo ""

echo -e "${GREEN}🎉 After these steps, your app will be LIVE!${NC}"
echo ""
echo "Frontend: https://your-app.vercel.app"
echo "Backend: https://your-app.railway.app"
echo "API Health: https://your-app.railway.app/api/health"
echo ""

echo -e "${BLUE}📚 For detailed instructions, see QUICK_DEPLOY.md${NC}"
echo ""
echo "Ready to make it live? Let's go! 🚀"