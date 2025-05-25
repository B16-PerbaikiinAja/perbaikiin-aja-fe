// src/feature-4/utils/helpers.js

/**
 * Format currency value to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'Not specified';
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
 * Get transaction type label
 * @param {string} type - Transaction type
 * @returns {string} Human readable type
 */
export const getTransactionTypeLabel = (type) => {
  const labels = {
    'DEPOSIT': 'Deposit',
    'WITHDRAWAL': 'Withdrawal',
    'PAYMENT': 'Payment',
    'REFUND': 'Refund',
    'SERVICE_PAYMENT': 'Service Payment',
  };
  
  return labels[type] || type;
};

/**
 * Get transaction type icon and color
 * @param {string} type - Transaction type
 * @returns {object} Icon and color information
 */
export const getTransactionTypeStyle = (type) => {
  switch (type) {
    case 'DEPOSIT':
      return { color: '#28a745', icon: '↑' };
    case 'WITHDRAWAL':
      return { color: '#dc3545', icon: '↓' };
    case 'PAYMENT':
      return { color: '#fd7e14', icon: '←' };
    case 'REFUND':
      return { color: '#20c997', icon: '→' };
    case 'SERVICE_PAYMENT':
      return { color: '#6f42c1', icon: '←' };
    default:
      return { color: '#6c757d', icon: '•' };
  }
};
