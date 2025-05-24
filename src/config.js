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
    // In production (AWS), use the configured API URL from environment variables
    // The API URL already includes the /api path
    apiUrl: process.env.REACT_APP_PROD_API_URL || 'https://q70cx5xfkl.execute-api.eu-north-1.amazonaws.com/dev/api',
  },
};

// Get the configuration for the current environment
const config = environmentConfig[environment];

// For debugging purposes, log the config
console.log('Current environment:', environment);
console.log('Current API URL:', config.apiUrl);

// Export the configuration
export default config;
