# 🚀 Reddy's Kitchen: Professional Hosting Guide

This guide will walk you through deploying your full-stack application from scratch.

---

## 📋 Table of Contents
1. [Step 1: Preparation](#step-1-preparation)
2. [Step 2: Database (MongoDB Atlas)](#step-2-database-mongodb-atlas)
3. [Step 3: Backend Deployment (Options)](#step-3-backend-deployment)
4. [Step 4: Frontend Deployment](#step-4-frontend-deployment)
5. [Step 5: Connecting Both](#step-5-connecting-both)

---

## Step 1: Preparation
1. **Push to GitHub**: Ensure your code is in a public or private GitHub repository.
2. **Environment Variables**: Have your `.env` values ready (see `backend/.env.example`).
3. **Generate a Secret**: In your terminal, run:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Save this string as your `JWT_SECRET`.

---

## Step 2: Database (MongoDB Atlas)
1. Login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **FREE Shared Cluster**.
3. **Database Access**: Create a user (e.g., `app_user`) and a strong password.
4. **Network Access**: Click "Add IP Address" and select **Allow Access From Anywhere (0.0.0.0/0)**.
5. **Connection String**: Click **Connect** -> **Connect your application**. Copy the `mongodb+srv://...` string. 
   > [!IMPORTANT]
   > Replace `<password>` in the string with your actual database user password.

---

## Step 3: Backend Deployment

### Option A: Render (Best for Beginners)
1. Go to [Render](https://render.com) and create a **Web Service**.
2. Connect your GitHub Repo.
3. **Root Directory**: `backend`
4. **Runtime**: `Node`
5. **Build Command**: `npm install`
6. **Start Command**: `node server.js`
7. **Environment Variables**: Add `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`.
8. **Result**: Your URL will look like `https://reddy-kitchen-api.onrender.com`.

### Option B: Vercel (Using `vercel.json`)
1. Go to [Vercel](https://vercel.com) and create a **New Project**.
2. Connect your GitHub Repo.
3. **Root Directory**: `backend`.
4. **Framework Preset**: `Other`.
5. **Environment Variables**: Add your keys.
6. **Result**: Your URL will look like `https://reddy-kitchen-api.vercel.app`.

---

## Step 4: Frontend Deployment (Vercel / Netlify)
1. Create a **New Project** on Vercel or Netlify.
2. Connect your GitHub Repo.
3. **Root Directory**: `frontend`.
4. **Framework Preset**: `Vite`.
5. **Environment Variables**:
   *   `VITE_API_URL`: `[YOUR_BACKEND_URL]/api` (e.g., `https://my-api.onrender.com/api`)
6. Click **Deploy**.

---

## Step 5: Connecting Both
For security and functionality, you must tell the backend which website is allowed to talk to it.

1. Copy your **Frontend URL** (e.g., `https://reddy-kitchen.vercel.app`).
2. Go to your **Backend Service Settings** (on Render/Vercel).
3. Add a new Environment Variable:
   - Key: `FRONTEND_URL`
   - Value: `https://reddy-kitchen.vercel.app`
4. **Restart/Redeploy** the backend.

---

## 🛠 Troubleshooting
*   **"CORS Error"**: Double-check `FRONTEND_URL` in backend settings. It must match your live site perfectly (no trailing slash).
*   **"White Screen"**: Check the browser console (F12) for `VITE_API_URL` errors. Ensure the URL ends with `/api`.
*   **"MongoDB Error"**: Ensure your IP whitelist is set to `0.0.0.0/0` in Atlas.
