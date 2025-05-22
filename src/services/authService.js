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
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
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
