# Deployment Guide

## Frontend (Vercel)

1. Go to vercel.com and sign up with GitHub
2. Click "New Project" and select your teachhub-saas repository
3. Set Build Command: `cd client && npm run build`
4. Set Output Directory: `client/build`
5. Add Environment Variable: `REACT_APP_API_URL` = your backend URL
6. Deploy!

## Backend (Railway)

1. Go to railway.app and sign up with GitHub
2. Click "New Project" and select your repository
3. Add PostgreSQL plugin
4. Set Start Command: `cd server && npm start`
5. Add Environment Variables:
   - `DATABASE_URL` (from Railway Postgres)
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NODE_ENV=production`
   - `PORT=5000`
6. Deploy!
