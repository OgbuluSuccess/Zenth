# Vercel Deployment Guide for Monorepo (Frontend + Backend)

## Overview

This guide will help you deploy your full-stack application (both frontend and backend) to Vercel. We've set up your project to use Vercel's serverless functions for the backend API.

## Deployment Steps

### 1. Push Your Changes to GitHub

Make sure all the changes we've made are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Configure project for Vercel deployment"
git push
```

### 2. Connect Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Leave as detected (likely React)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `build` (default)

### 3. Add Environment Variables

In the Vercel project settings, add the following environment variables:

- `MONGODB_URI`: `mongodb+srv://investment:1Password@cluster0.yihwhok.mongodb.net/investment`
- `JWT_SECRET`: `your_jwt_secret_key` (use a strong, secure value)

### 4. Deploy

Click "Deploy" and wait for the deployment to complete.

## How This Works

We've set up your project with the following components:

1. **`api/index.js`**: This is a serverless function that runs your Express backend
2. **`vercel.json`**: Configuration file that tells Vercel how to build and route requests
3. **`src/config.js`**: Updated to use the correct API URL in production

With this setup:
- Frontend requests to `/api/*` will be routed to your serverless API
- Both frontend and backend will be deployed from the same codebase
- Your API will run on the same domain as your frontend

## Troubleshooting

### If Your API Doesn't Work

1. Check Vercel Function Logs:
   - Go to your Vercel project dashboard
   - Click on "Functions" tab
   - Look for any errors in the logs

2. Verify Environment Variables:
   - Make sure all required environment variables are set in Vercel

3. Check for Timeout Issues:
   - Serverless functions have execution limits (10-60 seconds)
   - MongoDB connection might take too long on cold starts

### If You Need to Make Changes

1. Update your code locally
2. Push changes to GitHub
3. Vercel will automatically redeploy

## Local Development

For local development, continue using:

```bash
npm run dev
```

This will run both your React frontend and Express backend locally.
