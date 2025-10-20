# ✅ CashKaro Clone - Deployment Checklist

## 🚨 URGENT: Your app shows 404 because it's not deployed yet!

Follow this checklist to make it live in 5 minutes:

## 📋 Step-by-Step Checklist

### ✅ STEP 1: Deploy Backend (Railway)
- [ ] Go to https://railway.app
- [ ] Sign up with GitHub
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select: `webdevil-hack/Cashkro`
- [ ] Choose branch: `main`
- [ ] Set Root Directory: `server`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cashkaro`
  - [ ] `JWT_SECRET=your_super_secret_jwt_key_here`
  - [ ] `CLIENT_URL=https://your-frontend.vercel.app`
  - [ ] `PORT=5000`
- [ ] **COPY BACKEND URL** (like: https://cashkaro-backend-production.up.railway.app)

### ✅ STEP 2: Deploy Frontend (Vercel)
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Click "New Project" → Import from GitHub
- [ ] Select: `webdevil-hack/Cashkro`
- [ ] Choose branch: `main`
- [ ] Set Root Directory: `client`
- [ ] Add environment variable:
  - [ ] `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api`
- [ ] Click "Deploy"
- [ ] **COPY FRONTEND URL** (like: https://cashkaro-clone.vercel.app)

### ✅ STEP 3: Set up Database (MongoDB Atlas)
- [ ] Go to https://cloud.mongodb.com
- [ ] Sign up for free
- [ ] Create cluster (FREE tier)
- [ ] Create database user:
  - [ ] Username: `cashkaro-user`
  - [ ] Password: `your_secure_password`
- [ ] Whitelist IP: `0.0.0.0/0` (Allow access from anywhere)
- [ ] Get connection string
- [ ] Update `MONGODB_URI` in Railway with your Atlas connection string

### ✅ STEP 4: Test Your Live App
- [ ] Visit your Vercel URL
- [ ] Try registering a new user
- [ ] Test login functionality
- [ ] Browse deals and merchants
- [ ] Check the dashboard

## 🎯 Expected Results

After completion, you should have:
- **Frontend**: `https://your-app.vercel.app` ✅ Working
- **Backend**: `https://your-app.railway.app` ✅ Working
- **API Health**: `https://your-app.railway.app/api/health` ✅ Working

## 🚨 Common Issues & Solutions

### Backend won't start:
- Check Railway logs
- Verify MongoDB connection string
- Make sure all environment variables are set

### Frontend shows errors:
- Check Vercel build logs
- Verify `NEXT_PUBLIC_API_URL` is correct
- Make sure backend is running

### Database connection fails:
- Check MongoDB Atlas connection string
- Verify IP whitelist includes 0.0.0.0/0
- Make sure database user has proper permissions

## ⏱️ Time Estimate: 5-10 minutes

## 🎉 Success!

Once all checkboxes are checked, your CashKaro clone will be live and accessible worldwide!

---

**Ready to make it live? Start with Step 1! 🚀**