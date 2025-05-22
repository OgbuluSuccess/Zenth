import axios from 'axios';
import { getToken } from './authService';
import config from '../config';

// Use the API URL from config instead of hardcoding it
const API_URL = config.apiUrl;

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      // You could redirect to login page or refresh token here
      console.error('Authentication error', response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;
