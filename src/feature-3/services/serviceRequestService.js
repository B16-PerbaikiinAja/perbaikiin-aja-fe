// src/feature-3/services/serviceRequestService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Service for handling service request related API calls
 */
const serviceRequestService = {
  /**
   * Get service requests for a technician
   * @param {string} technicianId - Technician ID
   * @param {string} status - Optional status filter
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getTechnicianServiceRequests: async (technicianId, status = null, token) => {
    try {
      let url = `${API_URL}/service-requests/technician/${technicianId}`;
      if (status) {
        url += `?status=${status}`;
      }

      const response = await fetch(url, {
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
      console.error('Error fetching technician service requests:', error);
      throw error;
    }
  },

  /**
   * Get service requests for a customer
   * @param {string} customerId - Customer ID
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getCustomerServiceRequests: async (customerId, token) => {
    try {
      const response = await fetch(`${API_URL}/service-requests/customer/${customerId}`, {
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
      console.error('Error fetching customer service requests:', error);
      throw error;
    }
  },

  /**
   * Update service request status
   * @param {string} serviceRequestId - Service request ID
   * @param {string} status - New status
   * @param {number} finalPrice - Final price (required for COMPLETED status)
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  updateServiceRequestStatus: async (serviceRequestId, status, finalPrice = null, token) => {
    try {
      const requestBody = { status };
      if (finalPrice !== null) {
        requestBody.finalPrice = finalPrice;
      }

      const response = await fetch(`${API_URL}/service-requests/${serviceRequestId}/technician/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service request status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating service request status:', error);
      throw error;
    }
  },
};

export default serviceRequestService;