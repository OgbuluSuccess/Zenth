/**
 * Application configuration
 * Handles different environments (development, production)
 */

// Determine if we're running on Render
const isRender = typeof window !== 'undefined' && window.location.hostname.includes('render.com');

// Force production mode if we're on Render
const environment = isRender ? 'production' : (process.env.NODE_ENV || 'development');

// Get the base URL for API requests
const getBaseUrl = () => {
  // If we're in a browser environment
  if (typeof window !== 'undefined') {
    // If we're on Render or any production domain, use relative path
    if (environment === 'production') {
      return '/api';
    }
  }
  
  // Development fallbacks
  return process.env.REACT_APP_DEV_API_URL || 'http://172.20.10.3:5000/api';
};

// Central configuration for API URLs
const environmentConfig = {
  development: {
    // Use environment variable with fallback to local network IP
    apiUrl: process.env.REACT_APP_DEV_API_URL || 'http://172.20.10.3:5000/api',
  },
  production: {
    // For Render deployment, use the same domain but with /api path
    apiUrl: getBaseUrl(),
  },
};

// Get the configuration for the current environment
const config = environmentConfig[environment];

// For debugging purposes, log the config
console.log('Current environment:', environment);
console.log('Current API URL:', config.apiUrl);

// Export the configuration
export default config;
