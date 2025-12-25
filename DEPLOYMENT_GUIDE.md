# Deployment Guide (FREE STACK)

### 1. MongoDB Atlas (Database)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Shared Cluster** (Free Tier).
3. In **Network Access**, add `0.0.0.0/0` (Allow all) or specific IPs for security.
4. In **Database Access**, create a user with a password.
5. Get your **Connection String** (SRV) and replace `<password>` with your database user password.

### 2. Backend (Render / Railway)
**Using Render (Free):**
1. Create a `Web Service`.
2. Connect your GitHub Repo.
3. Set **Environment Variables** (from `.env.example`).
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Note your backend URL (e.g., `https://my-api.onrender.com`).

### 3. Frontend (Vercel / Netlify)
**Using Vercel (Free):**
1. Create a new Project.
2. Connect your GitHub Repo.
3. Set **Framework Preset**: `Vite`
4. Set **Environment Variables**:
   - `VITE_API_URL`: your-backend-url/api
5. Click **Deploy**.

### Environment Variables Summary
| Key | Value |
| :--- | :--- |
| `MONGO_URI` | Atlas SRV Connection String |
| `JWT_SECRET` | Any long random string |
| `EMAIL_USER` | Gmail Address |
| `EMAIL_PASS` | Gmail App Password |
| `FRONTEND_URL` | Deployed Frontend URL |
| `NODE_ENV` | `production` |
