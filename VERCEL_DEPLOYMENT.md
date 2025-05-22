# Vercel Deployment Guide

## Setting Up Environment Variables in Vercel

To make your API work correctly when deployed to Vercel, follow these steps:

### 1. Deploy Your Backend API

First, deploy your backend API to a hosting service like:
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Heroku](https://heroku.com)
- [DigitalOcean](https://digitalocean.com)

Make note of the URL where your API is hosted (e.g., `https://your-backend-api.onrender.com`).

### 2. Configure Environment Variables in Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add the following environment variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-api.onrender.com/api` (replace with your actual backend URL)
5. Make sure to select all environments where this variable should be available (Production, Preview, Development)
6. Click "Save"

### 3. Redeploy Your Frontend

After setting the environment variables:

1. Go to the "Deployments" tab
2. Find your latest deployment
3. Click the three dots menu (⋮) and select "Redeploy"

## Testing Your Deployment

After redeployment, your frontend should now connect to your deployed backend API instead of trying to connect to localhost.

## Local Development

For local development:

1. Create a `.env.local` file in your project root
2. Add the following line to use your local backend:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
3. Restart your development server

## Troubleshooting

If you're still experiencing connection issues:

1. Check your browser console for specific error messages
2. Verify that your backend API is running and accessible
3. Ensure CORS is properly configured on your backend to allow requests from your Vercel domain
4. Check that the API routes in your backend match the ones expected by your frontend
