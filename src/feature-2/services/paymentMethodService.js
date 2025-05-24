// src/feature-2/services/paymentMethodService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Service for handling payment method operations
 */
const paymentMethodService = {
  /**
   * Get all available payment methods
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getPaymentMethods: async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/payment-methods`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  /**
   * Get payment method by ID
   * @param {string} paymentMethodId - Payment method ID
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getPaymentMethodById: async (paymentMethodId, token) => {
    try {
      const response = await fetch(`${API_URL}/api/payment-methods/${paymentMethodId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment method:', error);
      throw error;
    }
  },
};

export default paymentMethodService;