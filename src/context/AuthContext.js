import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, isAuthenticated, logout } from '../services/authService';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const authenticated = isAuthenticated();
        if (authenticated) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid auth data
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const loginUser = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Logout function
  const logoutUser = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  // Auth context value
  const value = {
    user,
    loading,
    isLoggedIn,
    loginUser,
    logoutUser,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
