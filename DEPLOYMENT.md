# Deployment Guide - CashKaro Clone

This guide will help you deploy the CashKaro Clone project live for preview.

## 🚀 Quick Deploy Options

### Option 1: Vercel + Render (Recommended)

#### Frontend (Vercel)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Complete CashKaro Clone"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Set Root Directory to `frontend`
   - Add Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     ```
   - Click "Deploy"

#### Backend (Render)
1. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name**: cashkaro-backend
     - **Root Directory**: backend
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node
   - Add Environment Variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cashkaro
     REDIS_URL=redis://username:password@host:port
     JWT_SECRET=your-super-secret-jwt-key
     FRONTEND_URL=https://your-app.vercel.app
     CORS_ORIGIN=https://your-app.vercel.app
     ```
   - Click "Create Web Service"

2. **Set up MongoDB Atlas**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string
   - Update MONGO_URI in Render

3. **Set up Redis Cloud**
   - Go to [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud)
   - Create a free database
   - Get connection string
   - Update REDIS_URL in Render

### Option 2: Railway (All-in-One)

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect the project structure
   - Add environment variables in Railway dashboard
   - Deploy both frontend and backend services

### Option 3: Docker + Cloud Provider

1. **Build and Push Docker Images**
   ```bash
   # Build backend image
   docker build -t cashkaro-backend ./backend
   docker tag cashkaro-backend your-registry/cashkaro-backend:latest
   docker push your-registry/cashkaro-backend:latest

   # Build frontend image
   docker build -t cashkaro-frontend ./frontend
   docker tag cashkaro-frontend your-registry/cashkaro-frontend:latest
   docker push your-registry/cashkaro-frontend:latest
   ```

2. **Deploy to Cloud Provider**
   - Use AWS ECS, Google Cloud Run, or Azure Container Instances
   - Deploy both containers
   - Set up load balancer and networking

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_URL=https://your-frontend-url.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your-facebook-client-id
```

### Backend (.env)
```env
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cashkaro
REDIS_URL=redis://username:password@host:port
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.com
CORS_ORIGIN=https://your-frontend-url.com

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Payments (Optional)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Affiliate Networks (Optional)
ADMITAD_API_KEY=your-admitad-api-key
CUELINKS_API_KEY=your-cuelinks-api-key
IMPACT_API_KEY=your-impact-api-key
```

## 📊 Database Setup

### MongoDB Atlas
1. Create a free cluster
2. Create a database user
3. Whitelist your IP addresses
4. Get connection string
5. Run seed script after deployment

### Redis Cloud
1. Create a free database
2. Get connection details
3. Update REDIS_URL

## 🌱 Seed Database

After deployment, run the seed script:

```bash
# SSH into your backend server
cd backend
npm run seed
```

Or use Render's shell:
1. Go to your Render service
2. Click "Shell"
3. Run: `cd backend && npm run seed`

## 🔍 Testing Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API endpoints
   ```bash
   curl https://your-backend-url.com/health
   ```
3. **Database**: Check if data is seeded
4. **Authentication**: Test signup/login flow

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS_ORIGIN matches your frontend URL
   - Check if backend is accessible

2. **Database Connection**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure Redis is accessible

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs for errors

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values
   - Restart services after changes

### Debug Commands

```bash
# Check backend health
curl https://your-backend-url.com/health

# Check frontend build
npm run build

# Check database connection
npm run seed

# View logs
# Vercel: Dashboard → Functions → View Logs
# Render: Dashboard → Logs
```

## 📈 Performance Optimization

1. **Enable Caching**
   - Redis for session storage
   - CDN for static assets
   - Database query optimization

2. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor Render metrics
   - Set up error tracking

3. **Scale Resources**
   - Upgrade Render plan if needed
   - Use Vercel Pro for better performance
   - Optimize images and assets

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS everywhere
- [ ] Set up proper CORS
- [ ] Enable rate limiting
- [ ] Use environment variables
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify environment variables
3. Test locally with production config
4. Check service status pages
5. Contact support if needed

---

**Happy Deploying! 🎉**