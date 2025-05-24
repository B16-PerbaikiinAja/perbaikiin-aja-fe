// src/feature-3/utils/constants.js

export const SERVICE_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ESTIMATED: 'ESTIMATED',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
};

export const STATUS_LABELS = {
  [SERVICE_REQUEST_STATUS.PENDING]: 'Pending',
  [SERVICE_REQUEST_STATUS.ESTIMATED]: 'Awaiting Response',
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

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TECHNICIAN: 'TECHNICIAN',
  CUSTOMER: 'CUSTOMER',
};

// Action types available for different statuses
export const TECHNICIAN_ACTIONS = {
  [SERVICE_REQUEST_STATUS.PENDING]: ['PROVIDE_ESTIMATE'],
  [SERVICE_REQUEST_STATUS.ACCEPTED]: ['START_WORK'],
  [SERVICE_REQUEST_STATUS.IN_PROGRESS]: ['COMPLETE_WORK'],
  [SERVICE_REQUEST_STATUS.COMPLETED]: ['CREATE_REPORT'],
};

export const CUSTOMER_ACTIONS = {
  [SERVICE_REQUEST_STATUS.ESTIMATED]: ['ACCEPT_ESTIMATE', 'REJECT_ESTIMATE'],
};

// Form validation rules
export const VALIDATION_RULES = {
  ESTIMATE: {
    COST: {
      MIN: 1,
      MAX: 10000000, // 10 million IDR
    },
    COMPLETION_DATE: {
      MIN_DAYS_FROM_NOW: 1,
    },
    NOTES: {
      MAX_LENGTH: 500,
    },
  },
  REPORT: {
    REPAIR_DETAILS: {
      MIN_LENGTH: 20,
      MAX_LENGTH: 2000,
    },
    RESOLUTION_SUMMARY: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500,
    },
  },
  FEEDBACK: {
    MAX_LENGTH: 1000,
  },
};