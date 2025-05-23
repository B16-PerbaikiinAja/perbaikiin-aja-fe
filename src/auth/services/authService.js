// src/auth/services/authService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Authentication service for handling login, registration, and token management
 */
const authService = {
  /**
   * Register a new customer
   * @param {Object} userData - Customer registration data
   * @returns {Promise} - API response
   */
  registerCustomer: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new technician (admin only)
   * @param {Object} userData - Technician registration data
   * @param {string} token - Admin token
   * @returns {Promise} - API response
   */
  registerTechnician: async (userData, token) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup/technician`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Technician registration failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Technician registration error:', error);
      throw error;
    }
  },
  
  /**
   * Log in a user
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise} - Login response with token
   */
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  /**
   * Get the current user's token
   * @returns {string|null} - Current token or null if not logged in
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  /**
   * Get the current user data
   * @returns {Object|null} - Current user or null if not logged in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  /**
   * Check if a user is logged in
   * @returns {boolean} - True if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
  
  /**
   * Check if the current user is an admin
   * @returns {boolean} - True if user is an admin
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  },
  
  /**
   * Check if the current user is a technician
   * @returns {boolean} - True if user is a technician
   */
  isTechnician: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'TECHNICIAN';
  },
  
  /**
   * Check if the current user is a customer
   * @returns {boolean} - True if user is a customer
   */
  isCustomer: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'CUSTOMER';
  }
};

export default authService;