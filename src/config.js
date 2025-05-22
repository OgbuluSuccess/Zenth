/**
 * Application configuration
 * Handles different environments (development, production)
 */

const config = {
  development: {
    // Explicitly use port 5000 for the backend API
    apiUrl: 'http://localhost:5000/api',
  },
  production: {
    // In production on Vercel, the API is on the same domain
    // This approach works because we've set up the /api route in vercel.json
    apiUrl: process.env.REACT_APP_API_URL || '/api',
  },
};

// Determine current environment
const environment = process.env.NODE_ENV || 'development';

export default config[environment];
