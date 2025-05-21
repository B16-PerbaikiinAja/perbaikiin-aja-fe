// src/auth/context/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create the authentication context
const AuthContext = createContext();

/**
 * Auth Provider component to wrap the application and provide auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize user from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);
  
  /**
   * Register a new customer
   * @param {Object} userData - Customer registration data
   * @returns {Promise} - Registration response
   */
  const registerCustomer = async (userData) => {
    try {
      const response = await authService.registerCustomer(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Register a new technician (admin only)
   * @param {Object} userData - Technician registration data
   * @returns {Promise} - Registration response
   */
  const registerTechnician = async (userData) => {
    try {
      const token = authService.getToken();
      const response = await authService.registerTechnician(userData, token);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Log in a user
   * @param {Object} credentials - Login credentials
   * @returns {Promise} - Login response
   */
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user || {});
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  /**
   * Log out the current user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  // Context value
  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ADMIN',
    isTechnician: user?.role === 'TECHNICIAN',
    isCustomer: user?.role === 'CUSTOMER',
    registerCustomer,
    registerTechnician,
    login,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * @returns {Object} - Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;