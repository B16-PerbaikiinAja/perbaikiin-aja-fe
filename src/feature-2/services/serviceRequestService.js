// src/feature-2/services/serviceRequestService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Service for handling customer service request operations
 */
const customerServiceRequestService = {
  /**
   * Create a new service request
   * @param {Object} requestData - Service request data
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  createServiceRequest: async (requestData, token) => {
    try {
      const response = await fetch(`${API_URL}/service-requests/customer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create service request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating service request:', error);
      throw error;
    }
  },

  /**
   * Get customer's service requests
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getCustomerServiceRequests: async (token) => {
    try {
      const response = await fetch(`${API_URL}/service-requests/customer`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch service requests');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching service requests:', error);
      throw error;
    }
  },

  /**
   * Update a service request
   * @param {string} requestId - Service request ID
   * @param {Object} requestData - Updated service request data
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  updateServiceRequest: async (requestId, requestData, token) => {
    try {
      const response = await fetch(`${API_URL}/service-requests/customer/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating service request:', error);
      throw error;
    }
  },

  /**
   * Delete a service request
   * @param {string} requestId - Service request ID
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  deleteServiceRequest: async (requestId, token) => {
    try {
      const response = await fetch(`${API_URL}/service-requests/customer/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete service request');
      }

      return response.status === 204 ? {} : await response.json();
    } catch (error) {
      console.error('Error deleting service request:', error);
      throw error;
    }
  },
  /**
   * Respond to an estimate (accept or reject)
   * @param {string} serviceRequestId - Service Request ID
   * @param {string} estimateId - Estimate ID
   * @param {string} action - "ACCEPT" or "REJECT"
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  respondToEstimate: async (serviceRequestId, estimateId, action, feedback, token) => {
    try {
      const requestBody = {
        action, // 'ACCEPT' or 'REJECT'
      };
      
      // Include feedback if provided
      if (feedback && feedback.trim() !== '') {
        requestBody.feedback = feedback;
      }
      
      const response = await fetch(`${API_URL}/estimates/customer/${serviceRequestId}/response`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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

export default customerServiceRequestService;