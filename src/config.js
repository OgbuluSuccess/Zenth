/**
 * Application configuration
 * Handles different environments (development, production)
 */

// Determine if we're running on a production domain
const isProduction = () => {
  if (typeof window !== 'undefined') {
    // Check for common production domains
    return window.location.hostname.includes('vercel.app') || 
           window.location.hostname.includes('render.com') || 
           !window.location.hostname.includes('localhost');
  }
  return process.env.NODE_ENV === 'production';
};

// Set environment based on hostname or NODE_ENV
const environment = isProduction() ? 'production' : 'development';

// Get the base URL for API requests
const getBaseUrl = () => {
  // If we're in a browser environment
  if (typeof window !== 'undefined') {
    // If we're on a production domain, use relative path
    if (isProduction()) {
      return '/api';
    }
  }
  
  // Development fallbacks
  return process.env.REACT_APP_DEV_API_URL || 'http://localhost:5000/api';
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
