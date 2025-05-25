// src/feature-3/services/reportService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Service for handling report related API calls
 */
const reportService = {
  /**
   * Create a report for a completed service
   * @param {Object} reportData - Report data (serviceRequestId, repairDetails, resolutionSummary, completionDate)
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  createReport: async (reportData, token) => {
    try {
      const response = await fetch(`${API_URL}/reports/technician`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  /**
   * Get reports for a technician
   * @param {string} technicianId - Technician ID
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getTechnicianReports: async (technicianId, token) => {
    try {
      const response = await fetch(`${API_URL}/reports/technician/${technicianId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reports');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching technician reports:', error);
      throw error;
    }
  },

  /**
   * Get all reports (admin only)
   * @param {Object} filters - Optional filters (date_start, date_end, technicianId, reportId)
   * @param {string} token - Auth token
   * @returns {Promise} - API response
   */
  getAllReports: async (filters = {}, token) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const url = `${API_URL}/reports/admin${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reports');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all reports:', error);
      throw error;
    }
  },
};

export default reportService;