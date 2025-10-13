#!/bin/bash

# CashKaro Clone Deployment Script
echo "🚀 Starting CashKaro Clone deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Complete CashKaro Clone project"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository as origin:"
    echo "git remote add origin https://github.com/yourusername/cashkaro-clone.git"
    echo "Then run this script again."
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: Complete CashKaro Clone with all features" || echo "No changes to commit"
git push origin main

echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🌐 Next steps for deployment:"
echo "1. Go to https://vercel.com and deploy the frontend"
echo "2. Go to https://render.com and deploy the backend"
echo "3. Set up MongoDB Atlas and Redis Cloud"
echo "4. Configure environment variables"
echo "5. Run database seed script"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo "🎉 Your CashKaro Clone is ready to go live!"