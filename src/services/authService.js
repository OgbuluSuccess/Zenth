import axios from 'axios';
import config from '../config';

// Use the API URL from config instead of hardcoding it
const API_URL = config.apiUrl;

// Register user
export const register = async (userData) => {
  try {
    // Include role if provided, otherwise it will default to 'user' on the server
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    console.log('Attempting login with API URL:', API_URL);
    
    // First check if the API is reachable
    try {
      // Try direct access to the login endpoint
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login response received:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (rootErr) {
      console.error('Direct API access failed, trying configured URL:', rootErr);
      // Continue with the configured API URL if direct access fails
    }
    
    // If direct access failed, try using the configured API URL
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    console.log('Login response received:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    // More detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};
