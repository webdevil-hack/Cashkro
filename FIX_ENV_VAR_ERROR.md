# 🔧 FIX: Environment Variable Secret Error

## ❌ **Error:**
`Environment Variable "NEXT_PUBLIC_API_URL" references Secret "api_url", which does not exist.`

## ✅ **SOLUTION - 3 Quick Fixes:**

### **Fix 1: Create the Missing Secret (Recommended)**

1. **Go to your Vercel project dashboard**
2. **Click "Settings" tab**
3. **Click "Secrets" (left sidebar)**
4. **Click "Add New Secret"**
5. **Fill in:**
   - **Name**: `api_url`
   - **Value**: `https://your-backend.railway.app/api`
6. **Click "Save"**

### **Fix 2: Use Direct Environment Variable**

1. **Go to "Environment Variables" tab**
2. **Delete existing `NEXT_PUBLIC_API_URL`**
3. **Add new variable:**
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.railway.app/api` (direct value)
   - **Environment**: All (Production, Preview, Development)
4. **Click "Save"**

### **Fix 3: Use Localhost for Testing**

1. **Go to "Environment Variables" tab**
2. **Delete existing `NEXT_PUBLIC_API_URL`**
3. **Add new variable:**
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `http://localhost:5000/api`
   - **Environment**: All
4. **Click "Save"**

## 🚀 **After Fixing:**

1. **Go to "Deployments" tab**
2. **Click "Redeploy" on latest deployment**
3. **Wait for deployment to complete**

## 🎯 **Quick Steps (2 minutes):**

1. **Settings → Environment Variables**
2. **Delete `NEXT_PUBLIC_API_URL`**
3. **Add new:**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend.railway.app/api`
4. **Save**
5. **Redeploy**

## ✅ **Result:**
- ✅ Error will be gone
- ✅ App will deploy successfully
- ✅ Environment variable will work

**Try Fix 2 first - it's the quickest! 🚀**