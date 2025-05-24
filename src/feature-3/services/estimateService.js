// src/feature-3/services/estimateService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Service for handling estimate related API calls
 */
const estimateService = {
  /**
   * Create an estimate for a service request
   * @param {string} serviceRequestId - Service request ID
   * @param {Object} estimateData - Estimate data (estimatedCost, estimatedCompletionTime, notes)
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  createEstimate: async (serviceRequestId, estimateData, token) => {
    try {
      const response = await fetch(`${API_URL}/estimates/technician/service-requests/${serviceRequestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estimateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create estimate');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating estimate:', error);
      throw error;
    }
  },

  /**
   * Respond to an estimate (accept or reject)
   * @param {string} estimateId - Estimate ID
   * @param {string} action - "ACCEPT" or "REJECT"
   * @param {string} feedback - Optional feedback
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  respondToEstimate: async (estimateId, action, feedback = '', token) => {
    try {
      const response = await fetch(`${API_URL}/estimates/customer/${estimateId}/response`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, feedback }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to respond to estimate');
      }

      return await response.json();
    } catch (error) {
      console.error('Error responding to estimate:', error);
      throw error;
    }
  },
};

export default estimateService;