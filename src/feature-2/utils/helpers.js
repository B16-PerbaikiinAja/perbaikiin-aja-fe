// src/feature-2/utils/helpers.js

import { STATUS_COLORS, STATUS_LABELS, SERVICE_REQUEST_STATUS } from './constants';

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
 * Check if a service request can be edited
 * @param {string} status - Service request status
 * @returns {boolean} True if editable
 */
export const isServiceRequestEditable = (status) => {
  return status === SERVICE_REQUEST_STATUS.PENDING || status === SERVICE_REQUEST_STATUS.REJECTED;
};

/**
 * Check if a service request can be deleted
 * @param {string} status - Service request status
 * @returns {boolean} True if deletable
 */
export const isServiceRequestDeletable = (status) => {
  return status === SERVICE_REQUEST_STATUS.PENDING || status === SERVICE_REQUEST_STATUS.REJECTED;
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
 * Get max service date (90 days from now)
 * @returns {string} Max date string
 */
export const getMaxServiceDate = () => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  return maxDate.toISOString().split('T')[0];
};

/**
 * Validate service request form data
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validateServiceRequestForm = (formData) => {
  const errors = {};
  
  // Validate item name
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = 'Item name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Item name must be at least 2 characters long';
  } else if (formData.name.length > 100) {
    errors.name = 'Item name cannot exceed 100 characters';
  }
  
  // Validate condition
  if (!formData.condition || formData.condition.trim().length === 0) {
    errors.condition = 'Item condition is required';
  }
  
  // Validate issue description
  if (!formData.issueDescription || formData.issueDescription.trim().length === 0) {
    errors.issueDescription = 'Issue description is required';
  } else if (formData.issueDescription.trim().length < 10) {
    errors.issueDescription = 'Issue description must be at least 10 characters long';
  } else if (formData.issueDescription.length > 500) {
    errors.issueDescription = 'Issue description cannot exceed 500 characters';
  }
  
  // Validate service date
  if (!formData.serviceDate) {
    errors.serviceDate = 'Service date is required';
  } else {
    const selectedDate = new Date(formData.serviceDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    maxDate.setHours(23, 59, 59, 999);
    
    if (selectedDate < tomorrow) {
      errors.serviceDate = 'Service date must be at least tomorrow';
    } else if (selectedDate > maxDate) {
      errors.serviceDate = 'Service date cannot be more than 90 days from now';
    }
  }
  
  // Validate payment method
  if (!formData.paymentMethodId) {
    errors.paymentMethodId = 'Payment method is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Calculate estimated price with coupon discount
 * @param {number} basePrice - Base price
 * @param {object} coupon - Coupon object
 * @returns {object} Price calculation result
 */
export const calculatePriceWithCoupon = (basePrice, coupon) => {
  if (!basePrice || !coupon) {
    return {
      originalPrice: basePrice || 0,
      discountAmount: 0,
      finalPrice: basePrice || 0,
      discountPercentage: 0,
    };
  }
  
  const discountAmount = basePrice * coupon.discountValue;
  const finalPrice = basePrice - discountAmount;
  const discountPercentage = Math.round(coupon.discountValue * 100);
  
  return {
    originalPrice: basePrice,
    discountAmount,
    finalPrice,
    discountPercentage,
  };
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