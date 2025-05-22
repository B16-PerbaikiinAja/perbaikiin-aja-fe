// src/feature-3/components/ServiceRequestCard.js
import React, { useState } from 'react';
import ServiceRequestDetailsModal from './ServiceRequestDetailsModal';
import { formatCurrency, formatDate, getStatusStyle } from '../utils/helpers';

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    padding: '20px',
    marginBottom: '15px',
    fontFamily: 'Poppins, sans-serif',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
  },
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusEstimated: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  statusAccepted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusInProgress: {
    backgroundColor: '#e2e3e5',
    color: '#383d41',
  },
  statusCompleted: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  statusRejected: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  content: {
    marginBottom: '15px',
  },
  row: {
    display: 'flex',
    marginBottom: '8px',
  },
  label: {
    fontWeight: '500',
    minWidth: '120px',
    color: '#555',
  },
  value: {
    color: '#333',
  },
  estimateSection: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '15px',
  },
  estimateTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
  },
  primaryButton: {
    backgroundColor: '#4285f4',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
  },
  successButton: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  warningButton: {
    backgroundColor: '#ffc107',
    color: '#000',
  },
};

const ServiceRequestCard = ({ 
  serviceRequest, 
  userRole, 
  onProvideEstimate, 
  onUpdateStatus, 
  onCreateReport, 
  onRespondToEstimate 
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return styles.statusPending;
      case 'ESTIMATED':
        return styles.statusEstimated;
      case 'ACCEPTED':
        return styles.statusAccepted;
      case 'IN_PROGRESS':
        return styles.statusInProgress;
      case 'COMPLETED':
        return styles.statusCompleted;
      case 'REJECTED':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const renderTechnicianActions = () => {
    const status = serviceRequest.stateType || serviceRequest.status;
    
    return (
      <div style={styles.actions}>
        {status === 'PENDING' && (
          <button
            style={{...styles.button, ...styles.primaryButton}}
            onClick={() => onProvideEstimate && onProvideEstimate(serviceRequest)}
          >
            Provide Estimate
          </button>
        )}
        
        {status === 'ACCEPTED' && (
          <button
            style={{...styles.button, ...styles.warningButton}}
            onClick={() => onUpdateStatus && onUpdateStatus(serviceRequest, 'IN_PROGRESS')}
          >
            Start Work
          </button>
        )}
        
        {status === 'IN_PROGRESS' && (
          <button
            style={{...styles.button, ...styles.successButton}}
            onClick={() => onUpdateStatus && onUpdateStatus(serviceRequest, 'COMPLETED')}
          >
            Mark Complete
          </button>
        )}
        
        {status === 'COMPLETED' && !serviceRequest.report && (
          <button
            style={{...styles.button, ...styles.primaryButton}}
            onClick={() => onCreateReport && onCreateReport(serviceRequest)}
          >
            Create Report
          </button>
        )}
        
        <button
          style={{...styles.button, ...styles.secondaryButton}}
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    );
  };

  const renderCustomerActions = () => {
    const status = serviceRequest.stateType || serviceRequest.status;
    
    return (
      <div style={styles.actions}>
        {status === 'ESTIMATED' && serviceRequest.estimate && (
          <>
            <button
              style={{...styles.button, ...styles.successButton}}
              onClick={() => onRespondToEstimate && onRespondToEstimate(serviceRequest, 'ACCEPT')}
            >
              Accept Estimate
            </button>
            <button
              style={{...styles.button, ...styles.dangerButton}}
              onClick={() => onRespondToEstimate && onRespondToEstimate(serviceRequest, 'REJECT')}
            >
              Reject Estimate
            </button>
          </>
        )}
        
        <button
          style={{...styles.button, ...styles.secondaryButton}}
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        style={styles.card}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = styles.cardHover.transform;
          e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = styles.card.boxShadow;
        }}
      >
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>
              {serviceRequest.item?.name || 'Service Request'}
            </h3>
            <p style={styles.subtitle}>
              ID: {serviceRequest.id}
            </p>
          </div>
          <span style={{
            ...styles.status,
            ...getStatusStyle(serviceRequest.stateType || serviceRequest.status)
          }}>
            {serviceRequest.stateType || serviceRequest.status}
          </span>
        </div>

        <div style={styles.content}>
          <div style={styles.row}>
            <span style={styles.label}>Item Condition:</span>
            <span style={styles.value}>{serviceRequest.item?.condition || 'Not specified'}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Issue:</span>
            <span style={styles.value}>{serviceRequest.item?.issueDescription || serviceRequest.problemDescription || 'Not specified'}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Service Date:</span>
            <span style={styles.value}>{formatDate(serviceRequest.serviceDate)}</span>
          </div>
          
          {userRole === 'TECHNICIAN' && serviceRequest.customer && (
            <div style={styles.row}>
              <span style={styles.label}>Customer:</span>
              <span style={styles.value}>{serviceRequest.customer.fullName}</span>
            </div>
          )}
          
          {userRole === 'CUSTOMER' && serviceRequest.technician && (
            <div style={styles.row}>
              <span style={styles.label}>Technician:</span>
              <span style={styles.value}>{serviceRequest.technician.fullName}</span>
            </div>
          )}
        </div>

        {serviceRequest.estimate && (
          <div style={styles.estimateSection}>
            <div style={styles.estimateTitle}>Estimate Details</div>
            <div style={styles.row}>
              <span style={styles.label}>Cost:</span>
              <span style={styles.value}>{formatCurrency(serviceRequest.estimate.cost)}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Completion Date:</span>
              <span style={styles.value}>{formatDate(serviceRequest.estimate.completionDate)}</span>
            </div>
            {serviceRequest.estimate.notes && (
              <div style={styles.row}>
                <span style={styles.label}>Notes:</span>
                <span style={styles.value}>{serviceRequest.estimate.notes}</span>
              </div>
            )}
          </div>
        )}

        {userRole === 'TECHNICIAN' ? renderTechnicianActions() : renderCustomerActions()}
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <ServiceRequestDetailsModal
          serviceRequest={serviceRequest}
          userRole={userRole}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
};

export default ServiceRequestCard;