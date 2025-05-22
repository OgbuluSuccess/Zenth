import axios from 'axios';
import config from '../config';

// Create axios instance with base URL from config
const axiosInstance = axios.create({
  baseURL: config.apiUrl
});

// Add request interceptor to include auth token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
