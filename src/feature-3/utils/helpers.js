// src/feature-3/utils/helpers.js

import { SERVICE_REQUEST_STATUS, STATUS_COLORS, STATUS_LABELS } from './constants';

/**
 * Format currency value to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Not specified';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to a readable string
 * @param {string|Date} dateValue - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (dateValue, includeTime = false) => {
  if (!dateValue) return 'Not specified';
  
  const date = new Date(dateValue);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get status style based on status type
 * @param {string} status - Service request status
 * @returns {object} Style object
 */
export const getStatusStyle = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS[SERVICE_REQUEST_STATUS.PENDING];
};

/**
 * Get human readable status label
 * @param {string} status - Service request status
 * @returns {string} Human readable status
 */
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status;
};

/**
 * Check if a date is in the future
 * @param {string|Date} dateValue - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (dateValue) => {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  const now = new Date();
  return date > now;
};

/**
 * Check if a date is in the past
 * @param {string|Date} dateValue - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (dateValue) => {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  const now = new Date();
  return date < now;
};

/**
 * Get tomorrow's date in YYYY-MM-DD format
 * @returns {string} Tomorrow's date string
 */
export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date string
 */
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Validate estimate data
 * @param {object} estimateData - Estimate data to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validateEstimate = (estimateData) => {
  const errors = {};
  
  // Validate cost
  if (!estimateData.estimatedCost || estimateData.estimatedCost <= 0) {
    errors.estimatedCost = 'Please enter a valid cost estimate';
  } else if (estimateData.estimatedCost > 10000000) {
    errors.estimatedCost = 'Cost estimate cannot exceed Rp 10,000,000';
  }
  
  // Validate completion date
  if (!estimateData.estimatedCompletionTime) {
    errors.estimatedCompletionTime = 'Please select an estimated completion date';
  } else if (!isFutureDate(estimateData.estimatedCompletionTime)) {
    errors.estimatedCompletionTime = 'Completion date must be in the future';
  }
  
  // Validate notes (optional)
  if (estimateData.notes && estimateData.notes.length > 500) {
    errors.notes = 'Notes cannot exceed 500 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate report data
 * @param {object} reportData - Report data to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validateReport = (reportData) => {
  const errors = {};
  
  // Validate repair details
  if (!reportData.repairDetails || reportData.repairDetails.trim().length === 0) {
    errors.repairDetails = 'Please provide detailed repair information';
  } else if (reportData.repairDetails.trim().length < 20) {
    errors.repairDetails = 'Please provide more detailed repair information (minimum 20 characters)';
  } else if (reportData.repairDetails.length > 2000) {
    errors.repairDetails = 'Repair details cannot exceed 2000 characters';
  }
  
  // Validate resolution summary
  if (!reportData.resolutionSummary || reportData.resolutionSummary.trim().length === 0) {
    errors.resolutionSummary = 'Please provide a resolution summary';
  } else if (reportData.resolutionSummary.trim().length < 10) {
    errors.resolutionSummary = 'Please provide a more detailed summary (minimum 10 characters)';
  } else if (reportData.resolutionSummary.length > 500) {
    errors.resolutionSummary = 'Resolution summary cannot exceed 500 characters';
  }
  
  // Validate completion date
  if (!reportData.completionDate) {
    errors.completionDate = 'Please select the completion date';
  } else if (isFutureDate(reportData.completionDate)) {
    errors.completionDate = 'Completion date cannot be in the future';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get available actions for a service request based on user role and status
 * @param {object} serviceRequest - Service request object
 * @param {string} userRole - User role (TECHNICIAN, CUSTOMER, ADMIN)
 * @returns {array} Array of available actions
 */
export const getAvailableActions = (serviceRequest, userRole) => {
  const status = serviceRequest.stateType || serviceRequest.status;
  const actions = [];
  
  if (userRole === 'TECHNICIAN') {
    switch (status) {
      case SERVICE_REQUEST_STATUS.PENDING:
        actions.push('PROVIDE_ESTIMATE');
        break;
      case SERVICE_REQUEST_STATUS.ACCEPTED:
        actions.push('START_WORK');
        break;
      case SERVICE_REQUEST_STATUS.IN_PROGRESS:
        actions.push('COMPLETE_WORK');
        break;
      case SERVICE_REQUEST_STATUS.COMPLETED:
        if (!serviceRequest.report) {
          actions.push('CREATE_REPORT');
        }
        break;
    }
  } else if (userRole === 'CUSTOMER') {
    switch (status) {
      case SERVICE_REQUEST_STATUS.ESTIMATED:
        actions.push('ACCEPT_ESTIMATE', 'REJECT_ESTIMATE');
        break;
    }
  }
  
  // Always allow viewing details
  actions.push('VIEW_DETAILS');
  
  return actions;
};

/**
 * Generate a user-friendly description for a service request status
 * @param {string} status - Service request status
 * @param {string} userRole - User role
 * @returns {string} Status description
 */
export const getStatusDescription = (status, userRole) => {
  const descriptions = {
    TECHNICIAN: {
      [SERVICE_REQUEST_STATUS.PENDING]: 'Waiting for your estimate',
      [SERVICE_REQUEST_STATUS.ESTIMATED]: 'Waiting for customer response',
      [SERVICE_REQUEST_STATUS.ACCEPTED]: 'Ready to start work',
      [SERVICE_REQUEST_STATUS.IN_PROGRESS]: 'Work in progress',
      [SERVICE_REQUEST_STATUS.COMPLETED]: 'Work completed',
      [SERVICE_REQUEST_STATUS.REJECTED]: 'Request was rejected',
    },
    CUSTOMER: {
      [SERVICE_REQUEST_STATUS.PENDING]: 'Waiting for technician estimate',
      [SERVICE_REQUEST_STATUS.ESTIMATED]: 'Waiting for your response',
      [SERVICE_REQUEST_STATUS.ACCEPTED]: 'Technician will start soon',
      [SERVICE_REQUEST_STATUS.IN_PROGRESS]: 'Technician is working on your item',
      [SERVICE_REQUEST_STATUS.COMPLETED]: 'Service completed',
      [SERVICE_REQUEST_STATUS.REJECTED]: 'Request was cancelled',
    },
  };
  
  return descriptions[userRole]?.[status] || 'Status unknown';
};

/**
 * Calculate days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days
 */
export const daysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 * @param {string|Date} dateValue - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateValue) => {
  if (!dateValue) return 'Unknown';
  
  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 0) {
    return `In ${diffDays} days`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
};