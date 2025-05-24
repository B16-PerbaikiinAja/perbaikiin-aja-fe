// src/feature-4/services/walletService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Service for handling wallet operations
 */
const walletService = {
  /**
   * Get wallet details for authenticated user
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getWallet: async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/wallets/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch wallet details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching wallet details:', error);
      throw error;
    }
  },

  /**
   * Deposit money into wallet
   * @param {number} amount - Amount to deposit
   * @param {string} description - Optional description
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  deposit: async (amount, description = 'Deposit', token) => {
    try {
      const response = await fetch(`${API_URL}/api/wallets/deposit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process deposit');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during deposit:', error);
      throw error;
    }
  },

  /**
   * Withdraw money from wallet
   * @param {number} amount - Amount to withdraw
   * @param {string} description - Optional description
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  withdraw: async (amount, description = 'Withdrawal', token) => {
    try {
      const response = await fetch(`${API_URL}/api/wallets/me/withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process withdrawal');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during withdrawal:', error);
      throw error;
    }
  },

  /**
   * Get transaction history for authenticated user
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getTransactionHistory: async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/transactions/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch transaction history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  },
};

export default walletService;
