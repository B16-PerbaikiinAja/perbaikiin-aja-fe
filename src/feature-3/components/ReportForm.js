// src/feature-3/components/ReportForm.js
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
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    minHeight: '120px',
    resize: 'vertical',
  },
  error: {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '5px',
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
  serviceInfo: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  serviceTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
  },
  serviceDetail: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  helpText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
    fontStyle: 'italic',
  },
};

const ReportForm = ({ serviceRequest, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    repairDetails: '',
    resolutionSummary: '',
    completionDate: new Date().toISOString().split('T')[0], // Today's date
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.repairDetails.trim()) {
      newErrors.repairDetails = 'Please provide detailed repair information';
    } else if (formData.repairDetails.trim().length < 20) {
      newErrors.repairDetails = 'Please provide more detailed repair information (minimum 20 characters)';
    }

    if (!formData.resolutionSummary.trim()) {
      newErrors.resolutionSummary = 'Please provide a resolution summary';
    } else if (formData.resolutionSummary.trim().length < 10) {
      newErrors.resolutionSummary = 'Please provide a more detailed summary (minimum 10 characters)';
    }

    if (!formData.completionDate) {
      newErrors.completionDate = 'Please select the completion date';
    } else {
      const selectedDate = new Date(formData.completionDate);
      const today = new Date();
      const requestDate = new Date(serviceRequest.requestDate);
      
      if (selectedDate > today) {
        newErrors.completionDate = 'Completion date cannot be in the future';
      } else if (selectedDate < requestDate) {
        newErrors.completionDate = 'Completion date cannot be before the request date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const reportData = {
      serviceRequestId: serviceRequest.id,
      repairDetails: formData.repairDetails.trim(),
      resolutionSummary: formData.resolutionSummary.trim(),
      completionDate: formData.completionDate,
    };

    onSubmit(reportData);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Create Service Report</h2>
        
        <div style={styles.serviceInfo}>
          <div style={styles.serviceTitle}>Service Request Details</div>
          <div style={styles.serviceDetail}>
            <strong>Item:</strong> {serviceRequest.item?.name || 'Not specified'}
          </div>
          <div style={styles.serviceDetail}>
            <strong>Customer:</strong> {serviceRequest.customer?.fullName || 'Not specified'}
          </div>
          <div style={styles.serviceDetail}>
            <strong>Issue:</strong> {serviceRequest.item?.issueDescription || serviceRequest.problemDescription || 'Not specified'}
          </div>
          <div style={styles.serviceDetail}>
            <strong>Request Date:</strong> {formatDate(serviceRequest.requestDate)}
          </div>
          {serviceRequest.estimate && (
            <div style={styles.serviceDetail}>
              <strong>Estimated Cost:</strong> {formatCurrency(serviceRequest.estimate.cost)}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="repairDetails" style={styles.label}>
              Detailed Repair Information *
            </label>
            <textarea
              id="repairDetails"
              name="repairDetails"
              value={formData.repairDetails}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Describe in detail what repairs were performed, parts replaced, diagnostic steps taken, etc."
              disabled={isLoading}
              required
            />
            <div style={styles.helpText}>
              Provide comprehensive details about the repair process, including any parts replaced, 
              tools used, diagnostic steps, and technical procedures performed.
            </div>
            {errors.repairDetails && (
              <div style={styles.error}>{errors.repairDetails}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="resolutionSummary" style={styles.label}>
              Resolution Summary *
            </label>
            <textarea
              id="resolutionSummary"
              name="resolutionSummary"
              value={formData.resolutionSummary}
              onChange={handleChange}
              style={{...styles.textarea, minHeight: '80px'}}
              placeholder="Briefly summarize the solution and current status of the item"
              disabled={isLoading}
              required
            />
            <div style={styles.helpText}>
              Provide a brief summary of the resolution and the current functional status of the repaired item.
            </div>
            {errors.resolutionSummary && (
              <div style={styles.error}>{errors.resolutionSummary}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="completionDate" style={styles.label}>
              Actual Completion Date *
            </label>
            <input
              type="date"
              id="completionDate"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              style={styles.input}
              max={new Date().toISOString().split('T')[0]} // Today's date
              min={serviceRequest.requestDate ? serviceRequest.requestDate.split('T')[0] : undefined}
              disabled={isLoading}
              required
            />
            <div style={styles.helpText}>
              Select the actual date when the repair work was completed.
            </div>
            {errors.completionDate && (
              <div style={styles.error}>{errors.completionDate}</div>
            )}
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
            <button
              type="submit"
              style={{...styles.button, ...styles.primaryButton}}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Report...' : 'Create Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;