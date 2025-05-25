// src/feature-3/components/EstimateResponseForm.js
import React, { useState } from 'react';

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
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  },
  estimateInfo: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '6px',
    marginBottom: '25px',
  },
  estimateTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  estimateDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '14px',
  },
  label: {
    fontWeight: '500',
    color: '#555',
  },
  value: {
    color: '#333',
    fontWeight: '600',
  },
  costHighlight: {
    fontSize: '18px',
    color: '#4285f4',
  },
  notes: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
    marginTop: '15px',
    fontSize: '14px',
    color: '#666',
  },
  notesTitle: {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
  },
  actionSection: {
    marginBottom: '20px',
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  actionButton: {
    flex: 1,
    padding: '15px',
    borderRadius: '6px',
    border: '2px solid',
    background: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.3s',
  },
  acceptButton: {
    borderColor: '#28a745',
    color: '#28a745',
  },
  acceptButtonSelected: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  rejectButton: {
    borderColor: '#dc3545',
    color: '#dc3545',
  },
  rejectButtonSelected: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  formGroup: {
    marginBottom: '20px',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    minHeight: '80px',
    resize: 'vertical',
  },
  warning: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '20px',
    color: '#856404',
    fontSize: '14px',
  },
  warningIcon: {
    marginRight: '8px',
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '25px',
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
  dangerButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  successButton: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
};

const EstimateResponseForm = ({ serviceRequest, onSubmit, onCancel, isLoading }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedAction) {
      alert('Please select an action (Accept or Reject)');
      return;
    }

    onSubmit(selectedAction, feedback.trim());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimate = serviceRequest.estimate;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Respond to Estimate</h2>
        
        <div style={styles.estimateInfo}>
          <div style={styles.estimateTitle}>Estimate Details</div>
          
          <div style={styles.estimateDetail}>
            <span style={styles.label}>Item:</span>
            <span style={styles.value}>{serviceRequest.item?.name || 'Not specified'}</span>
          </div>
          
          <div style={styles.estimateDetail}>
            <span style={styles.label}>Technician:</span>
            <span style={styles.value}>{serviceRequest.technician?.fullName || 'Not specified'}</span>
          </div>
          
          <div style={styles.estimateDetail}>
            <span style={styles.label}>Estimated Cost:</span>
            <span style={{...styles.value, ...styles.costHighlight}}>
              {formatCurrency(estimate?.cost || 0)}
            </span>
          </div>
          
          <div style={styles.estimateDetail}>
            <span style={styles.label}>Completion Date:</span>
            <span style={styles.value}>{formatDate(estimate?.completionDate)}</span>
          </div>
          
          {estimate?.notes && (
            <div style={styles.notes}>
              <div style={styles.notesTitle}>Technician Notes:</div>
              {estimate.notes}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.actionSection}>
            <div style={styles.actionTitle}>Your Decision</div>
            
            <div style={styles.actionButtons}>
              <button
                type="button"
                style={{
                  ...styles.actionButton,
                  ...styles.acceptButton,
                  ...(selectedAction === 'ACCEPT' ? styles.acceptButtonSelected : {})
                }}
                onClick={() => setSelectedAction('ACCEPT')}
                disabled={isLoading}
              >
                ✓ Accept Estimate
              </button>
              
              <button
                type="button"
                style={{
                  ...styles.actionButton,
                  ...styles.rejectButton,
                  ...(selectedAction === 'REJECT' ? styles.rejectButtonSelected : {})
                }}
                onClick={() => setSelectedAction('REJECT')}
                disabled={isLoading}
              >
                ✗ Reject Estimate
              </button>
            </div>
          </div>

          {selectedAction === 'REJECT' && (
            <div style={styles.warning}>
              <span style={styles.warningIcon}>⚠️</span>
              <strong>Warning:</strong> Rejecting this estimate will permanently delete the service request. 
              You will need to create a new service request if you want to proceed with repairs.
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="feedback" style={styles.inputLabel}>
              Feedback {selectedAction === 'REJECT' ? '(Optional)' : '(Optional)'}
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={styles.textarea}
              placeholder={
                selectedAction === 'ACCEPT' 
                  ? "Any additional comments or requests for the technician..."
                  : selectedAction === 'REJECT'
                  ? "Please let us know why you're rejecting this estimate..."
                  : "Your feedback or comments..."
              }
              disabled={isLoading}
            />
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              style={{...styles.button, ...styles.secondaryButton}}
              disabled={isLoading}
            >
              Cancel
            </button>
            
            {selectedAction && (
              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(selectedAction === 'ACCEPT' ? styles.successButton : styles.dangerButton)
                }}
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Submitting...' 
                  : selectedAction === 'ACCEPT' 
                    ? 'Accept Estimate' 
                    : 'Reject Estimate'
                }
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstimateResponseForm;