// src/feature-2/components/EditServiceRequestForm.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import authService from '../../auth/services/authService';
import customerServiceRequestService from '../services/serviceRequestService';
import paymentMethodService from '../services/paymentMethodService';
import couponService from '../services/couponService';
import { ITEM_CONDITIONS, COMMON_ITEM_TYPES } from '../utils/constants';
import { getTomorrowDate, getMaxServiceDate, validateServiceRequestForm } from '../utils/helpers';

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
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    paddingBottom: '8px',
    borderBottom: '2px solid #f0f0f0',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
  },
  required: {
    color: '#dc3545',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    transition: 'border-color 0.3s',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '10px',
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
    marginTop: '4px',
  },
  couponSection: {
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
  },
  couponInput: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  couponInputField: {
    flex: 1,
  },
  couponButton: {
    padding: '10px 16px',
    backgroundColor: '#4285f4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    whiteSpace: 'nowrap',
  },
  couponStatus: {
    marginTop: '8px',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  couponValid: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  couponInvalid: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
  paymentSection: {
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  paymentOptionSelected: {
    borderColor: '#4285f4',
    backgroundColor: '#e3f2fd',
  },
  paymentRadio: {
    marginRight: '10px',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  paymentProvider: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
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
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100px',
    fontSize: '14px',
    color: '#666',
  },
  notification: {
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: '500',
  },
  successNotification: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  errorNotification: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
};

const EditServiceRequestForm = ({ serviceRequest, onCancel, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    condition: '',
    issueDescription: '',
    serviceDate: '',
    couponCode: '',
    paymentMethodId: '',
  });
  
  const [errors, setErrors] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [couponValidation, setCouponValidation] = useState({ isValid: false, message: '', coupon: null });
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    // Initialize form data with existing service request data
    if (serviceRequest) {
      setFormData({
        name: serviceRequest.item?.name || serviceRequest.name || '',
        condition: serviceRequest.item?.condition || serviceRequest.condition || '',
        issueDescription: serviceRequest.item?.issueDescription || serviceRequest.issueDescription || '',
        serviceDate: serviceRequest.serviceDate || '',
        couponCode: serviceRequest.coupon?.code || '',
        paymentMethodId: serviceRequest.paymentMethod?.id || '',
      });

      if (serviceRequest.paymentMethod) {
        setSelectedPaymentMethod(serviceRequest.paymentMethod);
      }

      if (serviceRequest.coupon) {
        setCouponValidation({
          isValid: true,
          message: `Coupon applied! ${Math.round(serviceRequest.coupon.discountValue * 100)}% discount`,
          coupon: serviceRequest.coupon
        });
      }
    }

    fetchPaymentMethods();
  }, [serviceRequest]);

  const fetchPaymentMethods = async () => {
    try {
      setPaymentMethodsLoading(true);
      const token = authService.getToken();
      const methods = await paymentMethodService.getPaymentMethods(token);
      setPaymentMethods(methods);
    } catch (error) {
      showNotification('error', 'Failed to load payment methods: ' + error.message);
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    const method = paymentMethods.find(m => m.id === methodId);
    setFormData({ ...formData, paymentMethodId: methodId });
    setSelectedPaymentMethod(method);
    
    // Clear payment method error
    if (errors.paymentMethodId) {
      setErrors({ ...errors, paymentMethodId: '' });
    }
  };

  const handleValidateCoupon = async () => {
    if (!formData.couponCode.trim()) {
      setCouponValidation({ isValid: false, message: 'Please enter a coupon code', coupon: null });
      return;
    }

    try {
      setCouponLoading(true);
      const token = authService.getToken();
      const validation = await couponService.validateCoupon(formData.couponCode, token);
      setCouponValidation(validation);
    } catch (error) {
      setCouponValidation({ isValid: false, message: 'Error validating coupon', coupon: null });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateServiceRequestForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      const token = authService.getToken();
      
      const requestData = {
        name: formData.name.trim(),
        condition: formData.condition,
        issueDescription: formData.issueDescription.trim(),
        serviceDate: formData.serviceDate,
        paymentMethodId: formData.paymentMethodId,
        couponCode: formData.couponCode.trim() || undefined,
      };

      const response = await customerServiceRequestService.updateServiceRequest(
        serviceRequest.id, 
        requestData, 
        token
      );
      
      showNotification('success', 'Service request updated successfully!');
      
      if (onSuccess) {
        onSuccess(response);
      }
      
    } catch (error) {
      showNotification('error', error.message || 'Failed to update service request');
    } finally {
      setLoading(false);
    }
  };

  if (paymentMethodsLoading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.loadingContainer}>
            Loading payment methods...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Service Request</h2>
          <button style={styles.closeButton} onClick={onCancel}>
            ×
          </button>
        </div>

        {/* Notifications */}
        {notification.message && (
          <div style={{
            ...styles.notification,
            ...(notification.type === 'success' ? styles.successNotification : styles.errorNotification)
          }}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Item Information */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Item Information</h3>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>
                  Item Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="e.g., iPhone 12, MacBook Pro"
                  list="common-items"
                  disabled={loading}
                  required
                />
                <datalist id="common-items">
                  {COMMON_ITEM_TYPES.map(item => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
                {errors.name && <div style={styles.error}>{errors.name}</div>}
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="condition" style={styles.label}>
                  Current Condition <span style={styles.required}>*</span>
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  style={styles.select}
                  disabled={loading}
                  required
                >
                  <option value="">Select condition</option>
                  {ITEM_CONDITIONS.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
                {errors.condition && <div style={styles.error}>{errors.condition}</div>}
              </div>
            </div>

            <div style={{...styles.formGroup, ...styles.fullWidth}}>
              <label htmlFor="issueDescription" style={styles.label}>
                Issue Description <span style={styles.required}>*</span>
              </label>
              <textarea
                id="issueDescription"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Describe the problem with your item in detail..."
                disabled={loading}
                required
              />
              {errors.issueDescription && <div style={styles.error}>{errors.issueDescription}</div>}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="serviceDate" style={styles.label}>
                Preferred Service Date <span style={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="serviceDate"
                name="serviceDate"
                value={formData.serviceDate}
                onChange={handleInputChange}
                style={styles.input}
                min={getTomorrowDate()}
                max={getMaxServiceDate()}
                disabled={loading}
                required
              />
              {errors.serviceDate && <div style={styles.error}>{errors.serviceDate}</div>}
            </div>
          </div>

          {/* Coupon Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Coupon (Optional)</h3>
            <div style={styles.couponSection}>
              <div style={styles.couponInput}>
                <div style={styles.couponInputField}>
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter coupon code"
                    disabled={loading || couponLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  style={styles.couponButton}
                  disabled={loading || couponLoading || !formData.couponCode.trim()}
                >
                  {couponLoading ? 'Validating...' : 'Validate'}
                </button>
              </div>
              
              {couponValidation.message && (
                <div style={{
                  ...styles.couponStatus,
                  ...(couponValidation.isValid ? styles.couponValid : styles.couponInvalid)
                }}>
                  {couponValidation.message}
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Payment Method <span style={styles.required}>*</span></h3>
            <div style={styles.paymentSection}>
              {paymentMethods.length === 0 ? (
                <div>No payment methods available. Please contact support.</div>
              ) : (
                paymentMethods.map(method => (
                  <div
                    key={method.id}
                    style={{
                      ...styles.paymentOption,
                      ...(formData.paymentMethodId === method.id ? styles.paymentOptionSelected : {})
                    }}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={formData.paymentMethodId === method.id}
                      onChange={() => handlePaymentMethodSelect(method.id)}
                      style={styles.paymentRadio}
                      disabled={loading}
                    />
                    <div style={styles.paymentInfo}>
                      <div style={styles.paymentName}>{method.name}</div>
                      <div style={styles.paymentProvider}>{method.provider}</div>
                    </div>
                  </div>
                ))
              )}
              
              {errors.paymentMethodId && <div style={styles.error}>{errors.paymentMethodId}</div>}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              style={{...styles.button, ...styles.secondaryButton}}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{...styles.button, ...styles.primaryButton}}
              disabled={loading || paymentMethods.length === 0}
            >
              {loading ? 'Updating Request...' : 'Update Service Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceRequestForm;