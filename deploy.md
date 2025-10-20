# 🚀 CashKaro Clone - Deployment Guide

This guide will help you deploy the CashKaro clone to production using modern cloud platforms.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available) or Heroku account
- MongoDB Atlas account (free tier available)

## 🌐 Deployment Options

### Option 1: Vercel + Railway + MongoDB Atlas (Recommended)

#### Step 1: Deploy Backend to Railway

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Railway:**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose the `server` folder as root directory
   - Railway will automatically detect it's a Node.js app

3. **Set Environment Variables in Railway:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=https://your-frontend-domain.vercel.app
   PORT=5000
   ```

#### Step 2: Set up MongoDB Atlas

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP (0.0.0.0/0 for Railway)

2. **Get Connection String:**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use this in Railway environment variables

#### Step 3: Deploy Frontend to Vercel

1. **Deploy to Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project" → Import from GitHub
   - Select your repository
   - Set root directory to `client`
   - Vercel will auto-detect Next.js

2. **Set Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app/api
   ```

### Option 2: Vercel + Heroku + MongoDB Atlas

#### Backend on Heroku

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy to Heroku:**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create your-cashkaro-backend
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set JWT_SECRET=your_super_secret_jwt_key
   heroku config:set CLIENT_URL=https://your-frontend-domain.vercel.app
   
   # Deploy
   git subtree push --prefix=server heroku main
   ```

## 🔧 Environment Variables Setup

### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cashkaro?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Client URL
CLIENT_URL=https://your-frontend-domain.vercel.app

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin
ADMIN_EMAIL=admin@cashkaro-clone.com
ADMIN_PASSWORD=your_admin_password
```

### Frontend Environment Variables

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app/api
```

## 🚀 Quick Deploy Script

I've created a deployment script to automate the process:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## 📱 Post-Deployment Steps

1. **Test the API:**
   ```bash
   curl https://your-backend-domain.railway.app/api/health
   ```

2. **Test the Frontend:**
   - Visit your Vercel URL
   - Test user registration
   - Test login functionality

3. **Set up Admin Account:**
   - Register a new user
   - Update the user role to 'admin' in MongoDB Atlas
   - Access admin features

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Make sure `CLIENT_URL` in backend matches your frontend domain
   - Check CORS configuration in `server/index.js`

2. **Database Connection Issues:**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs in deployment platform

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Restart services after changing variables

## 📊 Monitoring

### Railway Monitoring:
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel Monitoring:
- Check function logs
- Monitor build performance
- Set up analytics

### MongoDB Atlas Monitoring:
- Monitor database performance
- Set up alerts for connection issues
- Track query performance

## 🔒 Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS (automatic with Vercel/Railway)
- [ ] Set up proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up database user with minimal permissions
- [ ] Regular security updates

## 📈 Scaling

### Database Scaling:
- Upgrade MongoDB Atlas plan
- Implement database sharding
- Add read replicas

### Application Scaling:
- Upgrade Railway/Heroku plan
- Implement caching (Redis)
- Add CDN for static assets
- Use load balancers

## 🎉 Success!

Once deployed, your CashKaro clone will be live and accessible to users worldwide!

**Frontend URL:** `https://your-app.vercel.app`
**Backend URL:** `https://your-app.railway.app`
**API Health:** `https://your-app.railway.app/api/health`

## 📞 Support

If you encounter any issues during deployment:
1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally first
4. Check this troubleshooting guide

Happy deploying! 🚀