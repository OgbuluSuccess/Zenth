# Vercel Deployment Guide for Zynith Investment Platform

## Prerequisites

1. A Vercel account
2. Your MongoDB connection string
3. Your JWT secret key

## Setting Up Environment Variables

Before deploying to Vercel, you need to set up the following environment variables in the Vercel dashboard:

1. **MONGODB_URI**: Your MongoDB connection string
2. **JWT_SECRET**: Your JWT secret key for authentication
3. **CI**: Set to "false" to prevent build failures due to warnings
4. **ESLINT_NO_DEV_ERRORS**: Set to "true" to prevent ESLint errors from failing the build
5. **DISABLE_ESLINT_PLUGIN**: Set to "true" to disable ESLint during build

## Steps to Deploy

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and login to your account

2. **Import Your Repository**: Click on "Add New..." > "Project" and select your GitHub repository

3. **Configure Project**:
   - Framework Preset: Select "Create React App"
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Environment Variables**:
   - Add all the environment variables listed above
   - For sensitive variables like MONGODB_URI and JWT_SECRET, you can use Vercel Secrets
   - To create a secret: `vercel secrets add mongodb-uri "your-mongodb-connection-string"`
   - Then reference it in vercel.json as: `"MONGODB_URI": "@mongodb-uri"`

5. **Deploy**: Click on "Deploy" and wait for the build to complete

## Troubleshooting

### 500 Errors on API Endpoints

If you're getting 500 errors when accessing API endpoints:

1. Check that your MongoDB connection string is correct
2. Verify that all environment variables are properly set
3. Check Vercel logs for specific error messages

### 404 Errors for Static Assets

If static assets like images are returning 404 errors:

1. Make sure the assets are properly copied to the build directory
2. Verify that the routes in vercel.json are correctly configured
3. Check that the paths in your React components are correct

## Verifying Deployment

After deployment, you should:

1. Test all API endpoints to ensure they're working correctly
2. Verify that all static assets are loading properly
3. Test user authentication and other key features

## Updating Your Deployment

To update your deployment:

1. Make changes to your code locally
2. Commit and push to your GitHub repository
3. Vercel will automatically redeploy your application

If you need to update environment variables:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Update the variables as needed
4. Redeploy your application
