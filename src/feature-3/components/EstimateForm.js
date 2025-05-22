// src/feature-3/components/EstimateForm.js
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
    minHeight: '80px',
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
};

const EstimateForm = ({ serviceRequest, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    estimatedCost: '',
    estimatedCompletionTime: '',
    notes: '',
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

    if (!formData.estimatedCost || formData.estimatedCost <= 0) {
      newErrors.estimatedCost = 'Please enter a valid cost estimate';
    }

    if (!formData.estimatedCompletionTime) {
      newErrors.estimatedCompletionTime = 'Please select an estimated completion date';
    } else {
      const selectedDate = new Date(formData.estimatedCompletionTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.estimatedCompletionTime = 'Completion date must be in the future';
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

    const estimateData = {
      estimatedCost: parseFloat(formData.estimatedCost),
      estimatedCompletionTime: formData.estimatedCompletionTime,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit(estimateData);
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Provide Estimate</h2>
        
        <div style={styles.serviceInfo}>
          <div style={styles.serviceTitle}>Service Request Details</div>
          <div style={styles.serviceDetail}>
            <strong>Item:</strong> {serviceRequest.item?.name || 'Not specified'}
          </div>
          <div style={styles.serviceDetail}>
            <strong>Condition:</strong> {serviceRequest.item?.condition || 'Not specified'}
          </div>
          <div style={styles.serviceDetail}>
            <strong>Issue:</strong> {serviceRequest.item?.issueDescription || serviceRequest.problemDescription || 'Not specified'}
          </div>
          <div style={styles.serviceDetail}>
            <strong>Customer:</strong> {serviceRequest.customer?.fullName || 'Not specified'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="estimatedCost" style={styles.label}>
              Estimated Cost (IDR) *
            </label>
            <input
              type="number"
              id="estimatedCost"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., 150000"
              min="1"
              step="1000"
              disabled={isLoading}
              required
            />
            {formData.estimatedCost && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Rp {formatCurrency(formData.estimatedCost)}
              </div>
            )}
            {errors.estimatedCost && (
              <div style={styles.error}>{errors.estimatedCost}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="estimatedCompletionTime" style={styles.label}>
              Estimated Completion Date *
            </label>
            <input
              type="date"
              id="estimatedCompletionTime"
              name="estimatedCompletionTime"
              value={formData.estimatedCompletionTime}
              onChange={handleChange}
              style={styles.input}
              min={getTomorrowDate()}
              disabled={isLoading}
              required
            />
            {errors.estimatedCompletionTime && (
              <div style={styles.error}>{errors.estimatedCompletionTime}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="notes" style={styles.label}>
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Any additional information about the repair process, parts needed, etc."
              disabled={isLoading}
            />
            {errors.notes && (
              <div style={styles.error}>{errors.notes}</div>
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
              {isLoading ? 'Submitting...' : 'Submit Estimate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstimateForm;