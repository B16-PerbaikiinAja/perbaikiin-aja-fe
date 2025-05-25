// src/feature-2/components/ServiceRequestDetailsModal.js
import React from 'react';
import { formatCurrency, formatDate, getStatusStyle, getStatusLabel } from '../utils/helpers';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    fontFamily: 'Poppins, sans-serif',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '30px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '20px',
    display: 'inline-block',
  },
  section: {
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '8px',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '15px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '5px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#333',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  issueDescription: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
  estimateCard: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #bbdefb',
  },
  estimateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  estimateTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  estimateCost: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1976d2',
  },
  reportCard: {
    backgroundColor: '#f0f8ff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #b3d9ff',
  },
  reportTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  reportContent: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
  technicianCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  couponCard: {
    backgroundColor: '#e8f5e8',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #c8e6c9',
  },
  couponInfo: {
    fontSize: '14px',
    color: '#2e7d32',
  },
  timeline: {
    position: 'relative',
    paddingLeft: '30px',
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: '20px',
  },
  timelineIcon: {
    position: 'absolute',
    left: '-38px',
    top: '2px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#4285f4',
  },
  timelineContent: {
    fontSize: '14px',
    color: '#333',
  },
  timelineDate: {
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
  },
};

const ServiceRequestDetailsModal = ({ serviceRequest, onClose }) => {
  const status = serviceRequest.stateType || serviceRequest.status;
  const costDiscountMultiplier = (1- serviceRequest.coupon?.discountValue) ?? 1;

  const getTimelineEvents = () => {
    const events = [];
    
    if (serviceRequest.requestDate) {
      events.push({
        title: 'Request Created',
        date: serviceRequest.requestDate,
        description: 'Service request was submitted'
      });
    }
    
    if (serviceRequest.estimate?.createdDate) {
      events.push({
        title: 'Estimate Provided',
        date: serviceRequest.estimate.createdDate,
        description: `Estimate of ${formatCurrency(serviceRequest.estimate.cost  )} provided`
      });
    }
    
    if (status === 'ACCEPTED' || status === 'IN_PROGRESS' || status === 'COMPLETED') {
      events.push({
        title: 'Estimate Accepted',
        date: serviceRequest.estimate?.createdDate || serviceRequest.requestDate,
        description: 'Customer accepted the estimate'
      });
    }
    
    if (status === 'IN_PROGRESS' || status === 'COMPLETED') {
      events.push({
        title: 'Work Started',
        date: serviceRequest.estimate?.createdDate || serviceRequest.requestDate,
        description: 'Technician started working on the item'
      });
    }
    
    if (status === 'COMPLETED') {
      events.push({
        title: 'Work Completed',
        date: serviceRequest.report?.completionDateTime || serviceRequest.estimate?.completionDate,
        description: 'Service has been completed'
      });
    }
    
    if (serviceRequest.report?.createdDateTime) {
      events.push({
        title: 'Report Created',
        date: serviceRequest.report.createdDateTime,
        description: 'Technician submitted completion report'
      });
    }
    
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const timelineEvents = getTimelineEvents();

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Service Request Details</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <span style={{
          ...styles.status,
          ...getStatusStyle(status)
        }}>
          {getStatusLabel(status)}
        </span>

        {/* Basic Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Basic Information</h3>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Request ID</span>
              <span style={styles.detailValue}>{serviceRequest.id}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Request Date</span>
              <span style={styles.detailValue}>{formatDate(serviceRequest.requestDate)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Service Date</span>
              <span style={styles.detailValue}>{formatDate(serviceRequest.serviceDate)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Payment Method</span>
              <span style={styles.detailValue}>
                {serviceRequest.paymentMethod ? 
                  `${serviceRequest.paymentMethod.name} (${serviceRequest.paymentMethod.provider})` : 
                  'Not specified'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Item Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Item Information</h3>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Item Name</span>
              <span style={styles.detailValue}>
                {serviceRequest.item?.name || serviceRequest.name || 'Not specified'}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Condition</span>
              <span style={styles.detailValue}>
                {serviceRequest.item?.condition || serviceRequest.condition || 'Not specified'}
              </span>
            </div>
            <div style={{...styles.detailItem, ...styles.fullWidth}}>
              <span style={styles.detailLabel}>Issue Description</span>
              <div style={styles.issueDescription}>
                {serviceRequest.item?.issueDescription || serviceRequest.issueDescription || 'Not specified'}
              </div>
            </div>
          </div>
        </div>

        {/* Technician Information */}
        {serviceRequest.technician && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Assigned Technician</h3>
            <div style={styles.technicianCard}>
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Name</span>
                  <span style={styles.detailValue}>{serviceRequest.technician.fullName}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Phone</span>
                  <span style={styles.detailValue}>{serviceRequest.technician.phoneNumber}</span>
                </div>
                {serviceRequest.technician.completedJobs !== undefined && (
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Completed Jobs</span>
                    <span style={styles.detailValue}>{serviceRequest.technician.completedJobs}</span>
                  </div>
                )}
                {serviceRequest.technician.address && (
                  <div style={{...styles.detailItem, ...styles.fullWidth}}>
                    <span style={styles.detailLabel}>Address</span>
                    <span style={styles.detailValue}>{serviceRequest.technician.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Coupon Information */}
        {serviceRequest.coupon && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Coupon Applied</h3>
            <div style={styles.couponCard}>
              <div style={styles.couponInfo}>
                <strong>Coupon Code:</strong> {serviceRequest.coupon.code}<br />
                <strong>Discount:</strong> {Math.round(serviceRequest.coupon.discountValue * 100)}%<br />
                <strong>Valid Until:</strong> {formatDate(serviceRequest.coupon.expiryDate)}
              </div>
            </div>
          </div>
        )}

        {/* Estimate Information */}
        {serviceRequest.estimate && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Estimate</h3>
            <div style={styles.estimateCard}>
              <div style={styles.estimateHeader}>
                <span style={styles.estimateTitle}>Repair Estimate</span>
                <span style={styles.estimateCost}>
                  {formatCurrency(serviceRequest.estimate.cost  )}
                </span>
              </div>
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Estimated Completion</span>
                  <span style={styles.detailValue}>
                    {formatDate(serviceRequest.estimate.completionDate)}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Estimate Created</span>
                  <span style={styles.detailValue}>
                    {formatDate(serviceRequest.estimate.createdDate)}
                  </span>
                </div>
                {serviceRequest.estimate.notes && (
                  <div style={{...styles.detailItem, ...styles.fullWidth}}>
                    <span style={styles.detailLabel}>Technician Notes</span>
                    <span style={styles.detailValue}>{serviceRequest.estimate.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Report Information */}
        {serviceRequest.report && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Completion Report</h3>
            <div style={styles.reportCard}>
              <div style={styles.reportTitle}>Service Report</div>
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Completion Date</span>
                  <span style={styles.detailValue}>
                    {formatDate(serviceRequest.report.completionDateTime)}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Report Created</span>
                  <span style={styles.detailValue}>
                    {formatDate(serviceRequest.report.createdDateTime)}
                  </span>
                </div>
                <div style={{...styles.detailItem, ...styles.fullWidth}}>
                  <span style={styles.detailLabel}>Repair Details</span>
                  <div style={styles.reportContent}>
                    {serviceRequest.report.repairDetails}
                  </div>
                </div>
                <div style={{...styles.detailItem, ...styles.fullWidth}}>
                  <span style={styles.detailLabel}>Resolution Summary</span>
                  <div style={styles.reportContent}>
                    {serviceRequest.report.repairSummary}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {timelineEvents.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Timeline</h3>
            <div style={styles.timeline}>
              {timelineEvents.map((event, index) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineIcon}></div>
                  <div style={styles.timelineContent}>
                    <strong>{event.title}</strong><br />
                    {event.description}<br />
                    <span style={styles.timelineDate}>{formatDate(event.date, true)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.actions}>
          <button
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetailsModal;