// src/feature-2/components/ServiceRequestCard.js
import React, { useState } from 'react';
import ServiceRequestDetailsModal from './ServiceRequestDetailsModal';
import { formatCurrency, formatDate, getStatusStyle, getStatusLabel, isServiceRequestEditable, isServiceRequestDeletable } from '../utils/helpers';

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
  titleSection: {
    flex: 1,
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
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
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
    flex: 1,
  },
  issueDescription: {
    marginTop: '10px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#333',
  },
  estimateSection: {
    backgroundColor: '#e3f2fd',
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
  couponInfo: {
    backgroundColor: '#e8f5e8',
    padding: '10px',
    borderRadius: '6px',
    marginTop: '10px',
    fontSize: '14px',
    color: '#2e7d32',
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
  editButton: {
    backgroundColor: '#ffc107',
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
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
  disabledButton: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
    cursor: 'not-allowed',
  },
  technicianInfo: {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '6px',
    marginTop: '10px',
  },
  technicianTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '5px',
  },
  technicianDetail: {
    fontSize: '14px',
    color: '#666',
  },
};

const ServiceRequestCard = ({ 
  serviceRequest, 
  onEdit, 
  onDelete, 
  onViewDetails,
  onRespondToEstimate,
  showActions = true 
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(serviceRequest);
    } else {
      setShowDetailsModal(true);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(serviceRequest);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this service request? This action cannot be undone.')) {
      onDelete(serviceRequest);
    }
  };
  
  const handleEstimateResponse = (response) => {
    if (onRespondToEstimate) {
      onRespondToEstimate(serviceRequest, response);
    }
  };

  const status = serviceRequest.stateType || serviceRequest.status;
  const canEdit = isServiceRequestEditable(status);
  const canDelete = isServiceRequestDeletable(status);
  const costDiscountMultiplier = (1- serviceRequest.coupon?.discountValue) ?? 1;

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
          <div style={styles.titleSection}>
            <h3 style={styles.title}>
              {serviceRequest.item?.name || serviceRequest.name || 'Service Request'}
            </h3>
            <p style={styles.subtitle}>
              Request ID: {serviceRequest.id}
            </p>
          </div>
          <span style={{
            ...styles.status,
            ...getStatusStyle(status)
          }}>
            {getStatusLabel(status)}
          </span>
        </div>

        <div style={styles.content}>
          <div style={styles.row}>
            <span style={styles.label}>Condition:</span>
            <span style={styles.value}>
              {serviceRequest.item?.condition || serviceRequest.condition || 'Not specified'}
            </span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Service Date:</span>
            <span style={styles.value}>{formatDate(serviceRequest.serviceDate)}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Request Date:</span>
            <span style={styles.value}>{formatDate(serviceRequest.requestDate)}</span>
          </div>
          
          {serviceRequest.paymentMethod && (
            <div style={styles.row}>
              <span style={styles.label}>Payment Method:</span>
              <span style={styles.value}>
                {serviceRequest.paymentMethod.name} ({serviceRequest.paymentMethod.provider})
              </span>
            </div>
          )}

          {(serviceRequest.item?.issueDescription || serviceRequest.issueDescription) && (
            <div style={styles.issueDescription}>
              <strong>Issue Description:</strong><br />
              {serviceRequest.item?.issueDescription || serviceRequest.issueDescription}
            </div>
          )}

          {/* Technician Information */}
          {serviceRequest.technician && (
            <div style={styles.technicianInfo}>
              <div style={styles.technicianTitle}>Assigned Technician</div>
              <div style={styles.technicianDetail}>
                {serviceRequest.technician.fullName}
              </div>
              {serviceRequest.technician.phoneNumber && (
                <div style={styles.technicianDetail}>
                  Phone: {serviceRequest.technician.phoneNumber}
                </div>
              )}
            </div>
          )}

          {/* Coupon Information */}
          {serviceRequest.coupon && (
            <div style={styles.couponInfo}>
              <strong>Coupon Applied:</strong> {serviceRequest.coupon.code}<br />
              Discount: {Math.round(serviceRequest.coupon.discountValue * 100)}%
            </div>
          )}

          {/* Estimate Information */}
          {serviceRequest.estimate && (
            <div style={styles.estimateSection}>
              <div style={styles.estimateTitle}>Estimate Details</div>
              <div style={styles.row}>
                <span style={styles.label}>{status !== 'COMPLETED' ? 'Estimated Cost:' : 'Final Cost'}</span>
                <span style={styles.value}>{serviceRequest.coupon === null || status !=='COMPLETED' ? formatCurrency(serviceRequest.estimate.cost) : (formatCurrency(serviceRequest.estimate.cost * costDiscountMultiplier))}</span>
              </div>

              {/* Show discount if coupon is applied */}
              {serviceRequest.coupon && serviceRequest.estimate.discountAmount && (
                <div style={styles.row}>
                  <span style={styles.label}>Discount ({Math.round(serviceRequest.coupon.discountValue * 100)}%):</span>
                  <span style={{...styles.value, color: '#28a745', fontWeight: '600'}}>
                    -{formatCurrency(serviceRequest.estimate.discountAmount)}
                  </span>
                </div>
              )}
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
              
              {status === 'ESTIMATED' && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  padding: '10px',
                  borderRadius: '5px',
                  marginTop: '10px',
                  fontSize: '14px',
                  color: '#856404'
                }}>
                  <strong>Action Required:</strong> Please review the estimate and accept or reject it.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div style={styles.actions}>
            <button
              style={{...styles.button, ...styles.secondaryButton}}
              onClick={handleViewDetails}
            >
              View Details
            </button>
            
            {/* Estimate response actions */}
            {status === 'ESTIMATED' && serviceRequest.estimate && onRespondToEstimate && (
              <>
                <button
                  style={{...styles.button, ...styles.successButton}}
                  onClick={() => handleEstimateResponse('ACCEPT')}
                >
                  Accept Estimate
                </button>
                <button
                  style={{...styles.button, ...styles.dangerButton}}
                  onClick={() => handleEstimateResponse('REJECT')}
                >
                  Reject Estimate
                </button>
              </>
            )}
            
            {canEdit && onEdit && (
              <button
                style={{...styles.button, ...styles.editButton}}
                onClick={handleEdit}
              >
                Edit Request
              </button>
            )}
            
            {canDelete && onDelete && (
              <button
                style={{...styles.button, ...styles.deleteButton}}
                onClick={handleDelete}
              >
                Delete Request
              </button>
            )}
            
            {(!canEdit && !canDelete) && (status !== 'COMPLETED') && (status !== 'ESTIMATED') && (
              <span style={{...styles.button, ...styles.disabledButton}}>
                Cannot modify after technician acceptance
              </span>
            )}
            
            {(status === 'ESTIMATED') && !serviceRequest.estimate && (
              <span style={{...styles.button, ...styles.disabledButton}}>
                Awaiting technician's estimate
              </span>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <ServiceRequestDetailsModal
          serviceRequest={serviceRequest}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
};

export default ServiceRequestCard;