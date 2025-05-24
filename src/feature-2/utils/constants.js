// src/feature-2/utils/constants.js

export const SERVICE_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ESTIMATED: 'ESTIMATED',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
};

export const STATUS_LABELS = {
  [SERVICE_REQUEST_STATUS.PENDING]: 'Pending Estimate',
  [SERVICE_REQUEST_STATUS.ESTIMATED]: 'Estimate Provided',
  [SERVICE_REQUEST_STATUS.ACCEPTED]: 'Accepted',
  [SERVICE_REQUEST_STATUS.IN_PROGRESS]: 'In Progress',
  [SERVICE_REQUEST_STATUS.COMPLETED]: 'Completed',
  [SERVICE_REQUEST_STATUS.REJECTED]: 'Rejected',
};

export const STATUS_COLORS = {
  [SERVICE_REQUEST_STATUS.PENDING]: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  [SERVICE_REQUEST_STATUS.ESTIMATED]: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  [SERVICE_REQUEST_STATUS.ACCEPTED]: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  [SERVICE_REQUEST_STATUS.IN_PROGRESS]: {
    backgroundColor: '#e2e3e5',
    color: '#383d41',
  },
  [SERVICE_REQUEST_STATUS.COMPLETED]: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  [SERVICE_REQUEST_STATUS.REJECTED]: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
};

export const ITEM_CONDITIONS = [
  'Excellent',
  'Good',
  'Fair',
  'Poor',
  'Broken',
  'Not Working',
];

export const COMMON_ITEM_TYPES = [
  'Smartphone',
  'Laptop',
  'Desktop Computer',
  'Tablet',
  'Television',
  'Audio System',
  'Gaming Console',
  'Camera',
  'Printer',
  'Router/Modem',
  'Smart Watch',
  'Headphones',
  'Other Electronics',
];

// Form validation rules
export const VALIDATION_RULES = {
  ITEM_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  ISSUE_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  SERVICE_DATE: {
    MIN_DAYS_FROM_NOW: 1,
    MAX_DAYS_FROM_NOW: 90,
  },
};