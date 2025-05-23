/**
 * Application configuration
 * Handles different environments (development, production)
 */

// Central configuration for API URLs
const config = {
  development: {
    // Use environment variable with fallback to local network IP
    apiUrl: process.env.REACT_APP_DEV_API_URL || 'http://172.20.10.3:5000/api',
  },
  production: {
    // In production (Vercel), use the configured API URL from environment variables
    // This allows easy configuration through Vercel's environment settings
    apiUrl: process.env.REACT_APP_PROD_API_URL || 'https://your-backend-url.com/api',
  },
};

// For debugging purposes, log the config
console.log('Current API URL:', config[process.env.NODE_ENV || 'development'].apiUrl);

// Determine current environment
const environment = process.env.NODE_ENV || 'development';

export default config[environment];
