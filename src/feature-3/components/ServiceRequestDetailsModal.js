// src/feature-3/components/ServiceRequestDetailsModal.js
import React from 'react';

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
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '20px',
    display: 'inline-block',
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
  estimateCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
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
    color: '#4285f4',
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
  primaryButton: {
    backgroundColor: '#4285f4',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
  },
};

const ServiceRequestDetailsModal = ({ serviceRequest, onClose, userRole }) => {
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

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
        description: `Estimate of ${formatCurrency(serviceRequest.estimate.cost)} provided`
      });
    }
    
    if (serviceRequest.stateType === 'ACCEPTED' || serviceRequest.stateType === 'IN_PROGRESS' || serviceRequest.stateType === 'COMPLETED') {
      events.push({
        title: 'Estimate Accepted',
        date: serviceRequest.estimate?.createdDate,
        description: 'Customer accepted the estimate'
      });
    }
    
    if (serviceRequest.stateType === 'IN_PROGRESS' || serviceRequest.stateType === 'COMPLETED') {
      events.push({
        title: 'Work Started',
        date: serviceRequest.estimate?.createdDate,
        description: 'Technician started working on the item'
      });
    }
    
    if (serviceRequest.stateType === 'COMPLETED') {
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
          ...getStatusStyle(serviceRequest.stateType || serviceRequest.status)
        }}>
          {serviceRequest.stateType || serviceRequest.status}
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
                {serviceRequest.paymentMethod?.name || 'Not specified'}
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
              <span style={styles.detailValue}>{serviceRequest.item?.name || 'Not specified'}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Condition</span>
              <span style={styles.detailValue}>{serviceRequest.item?.condition || 'Not specified'}</span>
            </div>
            <div style={{...styles.detailItem, ...styles.fullWidth}}>
              <span style={styles.detailLabel}>Issue Description</span>
              <span style={styles.detailValue}>
                {serviceRequest.item?.issueDescription || serviceRequest.problemDescription || 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* People Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>People Involved</h3>
          <div style={styles.detailGrid}>
            {serviceRequest.customer && (
              <>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Customer Name</span>
                  <span style={styles.detailValue}>{serviceRequest.customer.fullName}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Customer Phone</span>
                  <span style={styles.detailValue}>{serviceRequest.customer.phoneNumber}</span>
                </div>
              </>
            )}
            {serviceRequest.technician && (
              <>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Technician Name</span>
                  <span style={styles.detailValue}>{serviceRequest.technician.fullName}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Technician Phone</span>
                  <span style={styles.detailValue}>{serviceRequest.technician.phoneNumber}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Estimate Information */}
        {serviceRequest.estimate && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Estimate</h3>
            <div style={styles.estimateCard}>
              <div style={styles.estimateHeader}>
                <span style={styles.estimateTitle}>Repair Estimate</span>
                <span style={styles.estimateCost}>
                  {formatCurrency(serviceRequest.estimate.cost)}
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
                    <span style={styles.timelineDate}>{formatDate(event.date)}</span>
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