/**
 * Application configuration
 * Handles different environments (development, production)
 */

// Determine the current environment
const environment = process.env.NODE_ENV || 'development';

// Central configuration for API URLs
const environmentConfig = {
  development: {
    // Use environment variable with fallback to local network IP
    apiUrl: process.env.REACT_APP_DEV_API_URL || 'http://172.20.10.3:5000/api',
  },
  production: {
    // For Render deployment, use the same domain but with /api path
    apiUrl: process.env.REACT_APP_PROD_API_URL || '/api',
  },
};

// Get the configuration for the current environment
const config = environmentConfig[environment];

// For debugging purposes, log the config
console.log('Current environment:', environment);
console.log('Current API URL:', config.apiUrl);

// Export the configuration
export default config;
