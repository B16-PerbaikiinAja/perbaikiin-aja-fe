// src/feature-coupons/components/AdminCouponManagement.js
import React, { useState, useEffect } from 'react';
import { couponService } from '../services/couponService';
import { useAuth } from '../../auth/context/AuthContext';
import { AdminCouponForm } from './AdminCouponForm'; // Import the form component

const styles = {
    container: {
        fontFamily: 'Poppins, sans-serif',
        padding: '20px',
        maxWidth: '1200px',
        margin: '20px auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
    },
    h2: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 2px 5px rgba(0,123,255,0.2)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden', // Ensures rounded corners are applied
    },
    th: {
        backgroundColor: '#e9ecef',
        color: '#495057',
        padding: '15px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    td: {
        padding: '15px',
        borderBottom: '1px solid #dee2e6',
        fontSize: '14px',
        color: '#343a40',
    },
    trHover: {
        '&:hover': {
            backgroundColor: '#f1f1f1',
        },
    },
    actions: {
        display: 'flex',
        gap: '10px',
    },
    actionButton: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
    },
    editButton: {
        backgroundColor: '#ffc107',
        borderColor: '#ffc107',
        color: 'white',
        '&:hover': {
            backgroundColor: '#e0a800',
            borderColor: '#e0a800',
        },
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
        color: 'white',
        '&:hover': {
            backgroundColor: '#c82333',
            borderColor: '#bd2130',
        },
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#6c757d',
    },
    error: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '5px',
    },
    noCoupons: {
        textAlign: 'center',
        padding: '30px',
        fontSize: '16px',
        color: '#6c757d',
    }
};

const AdminCouponManagement = () => {
    const { token } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null); // For editing

    const fetchCoupons = async () => {
        if (!token) {
            setError('Authentication token is missing. Please log in.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await couponService.getAllCoupons(token);
            setCoupons(data);
        } catch (err) {
            console.error('Failed to fetch coupons:', err);
            setError(err.message || 'Failed to load coupons. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [token]); // Re-fetch if token changes

    const handleCreateClick = () => {
        setSelectedCoupon(null); // Clear any selected coupon for new creation
        setShowFormModal(true);
    };

    const handleEditClick = (coupon) => {
        setSelectedCoupon(coupon); // Set the coupon to be edited
        setShowFormModal(true);
    };

    const handleDeleteClick = async (couponCode) => {
        if (window.confirm(`Are you sure you want to delete coupon with code: ${couponCode}?`)) {
            setLoading(true);
            setError(null);
            try {
                await couponService.deleteCoupon(couponCode, token);
                await fetchCoupons(); // Refresh the list
            } catch (err) {
                console.error('Failed to delete coupon:', err);
                setError(err.message || 'Failed to delete coupon. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormClose = () => {
        setShowFormModal(false);
        setSelectedCoupon(null);
    };

    const handleSaveSuccess = () => {
        fetchCoupons(); // Refresh list after save
        handleFormClose(); // Close the modal
    };

    if (loading) {
        return <div style={styles.loading}>Loading coupons...</div>;
    }

    if (error) {
        return <div style={styles.error}>Error: {error}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.h2}>Coupon Management</h2>
                <button style={styles.addButton} onClick={handleCreateClick}>
                    Create New Coupon
                </button>
            </div>

            {coupons.length === 0 ? (
                <p style={styles.noCoupons}>No coupons found. Click "Create New Coupon" to add one.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Code</th>
                        <th style={styles.th}>Discount Value</th>
                        <th style={styles.th}>Max Usage</th>
                        <th style={styles.th}>Used Count</th>
                        <th style={styles.th}>Expiry Date</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {coupons.map((coupon) => (
                        <tr key={coupon.code} style={styles.trHover}>
                            <td style={styles.td}>{coupon.code}</td>
                            <td style={styles.td}>{(coupon.discountValue * 100).toFixed(0)}%</td> {/* Assuming discountValue is a fraction, display as percentage */}
                            <td style={styles.td}>{coupon.maxUsage}</td>
                            <td style={styles.td}>{coupon.usageCount}</td>
                            <td style={styles.td}>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                            <td style={styles.td}>
                                <div style={styles.actions}>
                                    <button
                                        style={{ ...styles.actionButton, ...styles.editButton }}
                                        onClick={() => handleEditClick(coupon)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                                        onClick={() => handleDeleteClick(coupon.code)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {showFormModal && (
                <AdminCouponForm
                    coupon={selectedCoupon}
                    onClose={handleFormClose}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default AdminCouponManagement;