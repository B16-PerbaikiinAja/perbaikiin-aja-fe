// src/feature-5/components/AdminCouponForm.js
import React, { useState, useEffect } from 'react';
import couponService from '../services/couponService';
import { useAuth } from '../../auth/context/AuthContext';
import authService from "../../auth/services/authService";

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
    },
    modal: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        width: '90%',
        maxWidth: '500px',
        fontFamily: 'Poppins, sans-serif',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#666',
    },
    h2: {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        fontFamily: 'Poppins, sans-serif',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '80px',
        resize: 'vertical',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        fontFamily: 'Poppins, sans-serif',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    },
    checkbox: {
        marginRight: '10px',
        width: '20px',
        height: '20px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px',
    },
    button: {
        padding: '12px 25px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.3s ease',
        border: 'none',
        fontFamily: 'Poppins, sans-serif',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        '&:hover': {
            backgroundColor: '#45a049',
        },
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: 'white',
        '&:hover': {
            backgroundColor: '#d32f2f',
        },
    },
    errorText: {
        color: '#f44336',
        fontSize: '14px',
        marginTop: '5px',
    }
};

const AdminCouponForm = ({ coupon, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        discountValue: '',
        maxUsage: '',
        expiryDate: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (coupon) {
            // When editing, populate the form with existing coupon data
            setFormData({
                discountValue: coupon.discountValue || '',
                maxUsage: coupon.maxUsage || '',
                expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            });
        } else {
            // Reset form for new coupon
            setFormData({
                discountValue: '',
                maxUsage: '',
                expiryDate: '',
            });
        }
        setErrors({});
        setSubmitError('');
    }, [coupon]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for the field being changed
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.discountValue || isNaN(formData.discountValue) || parseFloat(formData.discountValue) <= 0) {
            newErrors.discountValue = 'Discount value must be a positive number.';
        }
        if (!formData.maxUsage || isNaN(formData.maxUsage) || parseInt(formData.maxUsage) <= 0) {
            newErrors.maxUsage = 'Max usage must be a positive integer.';
        }
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required.';
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        const token  = authService.getToken();
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) {
            setSubmitError('Please correct the errors in the form.');
            return;
        }

        if (!token) { // <--- Ensure token is available
            setSubmitError('Authentication token is missing. Please log in.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                discountValue: parseFloat(formData.discountValue),
                maxUsage: parseInt(formData.maxUsage),
                expiryDate: new Date(formData.expiryDate).toISOString(),
            };

            let response;
            if (coupon && coupon.code) {
                // Editing existing coupon
                response = await couponService.updateCoupon(coupon.code, payload, token); // <--- Pass token
                console.log('Coupon updated:', response);
            } else {
                // Creating new coupon
                response = await couponService.createCoupon(payload, token); // <--- Pass token
                console.log('Coupon created:', response);
            }
            onSaveSuccess(); // Notify parent component of success
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error saving coupon:', error);
            setSubmitError(error.message || 'Failed to save coupon. Please try again.'); // Use error.message directly
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
                <h2 style={styles.h2}>{coupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                <form onSubmit={handleSubmit}>

                    <div style={styles.formGroup}>
                        <label htmlFor="discountValue" style={styles.label}>
                            Discount Value
                        </label>
                        <input
                            type="number"
                            id="discountValue"
                            name="discountValue"
                            value={formData.discountValue}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g., 0.15"
                            step="0.01"
                            required
                        />
                        {errors.discountValue && <p style={styles.errorText}>{errors.discountValue}</p>}
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="maxUsage" style={styles.label}>Max Usage</label>
                        <input
                            type="number"
                            id="maxUsage"
                            name="maxUsage"
                            value={formData.maxUsage}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g., 100"
                            min="1"
                            required
                        />
                        {errors.maxUsage && <p style={styles.errorText}>{errors.maxUsage}</p>}
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="expiryDate" style={styles.label}>Expiry Date</label>
                        <input
                            type="date"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        {errors.expiryDate && <p style={styles.errorText}>{errors.expiryDate}</p>}
                    </div>

                    {submitError && <p style={styles.errorText}>{submitError}</p>}

                    <div style={styles.buttonContainer}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ ...styles.button, ...styles.cancelButton }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ ...styles.button, ...styles.submitButton }}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (coupon ? 'Update Coupon' : 'Create Coupon')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCouponForm;