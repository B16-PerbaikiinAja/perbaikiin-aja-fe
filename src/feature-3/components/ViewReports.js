// src/feature-3/components/ViewReports.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reportService from '../services/reportService';
import { useAuth } from '../../auth/context/AuthContext';
import AuthService from "../../auth/services/authService";
import Dashboard from "../../components/Dashboard";
import DashboardNavbar from "../../components/DashboardNavbar";

const styles = {
    container: {
        fontFamily: 'Poppins, sans-serif',
    },
    content: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
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
    filterContainer: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
        flexWrap: 'wrap',
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '150px',
    },
    label: {
        marginBottom: '5px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#555',
    },
    input: {
        padding: '10px 12px',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontFamily: 'Poppins, sans-serif',
    },
    filterButton: {
        backgroundColor: '#4A90E2',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        alignSelf: 'flex-end',
        marginTop: 'auto',
    },
    clearFiltersButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        alignSelf: 'flex-end',
        marginTop: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    th: {
        backgroundColor: '#4A90E2',
        color: '#fff',
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
    noReports: {
        textAlign: 'center',
        padding: '30px',
        fontSize: '16px',
        color: '#6c757d',
    },
    unauthorizedMessage: {
        textAlign: 'center',
        color: '#e53935',
        padding: '20px',
        fontSize: '18px',
        backgroundColor: '#ffebee',
        borderRadius: '5px',
        margin: '20px auto',
        maxWidth: '500px',
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontFamily: 'Poppins, sans-serif',
        marginTop: '20px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
};

const ViewReports = () => {
    const { token, isAdmin } = useAuth(); // Get token and isAdmin from context
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        date_start: '',
        date_end: '',
        technicianId: '',
        reportId: '',
    });

    // Authorization check
    useEffect(() => {
        if (!isAdmin) {
            // Redirect if not an admin
            navigate('/dashboard');
        } else {
            // If admin, fetch reports on component mount or token/filter change
            fetchReports();
        }
    }, [token, isAdmin, navigate]);

    const fetchReports = async () => {
        const token = AuthService.getToken();
        if (!token) {
            setError('Authentication token is missing. Please log in.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const responseData = await reportService.getAllReports(filters, token);

            if (responseData && Array.isArray(responseData.reports)) {
                setReports(responseData.reports);
            } else {
                // Handle cases where 'reports' might be missing or not an array
                console.warn('API response did not contain a valid reports array:', responseData);
                setReports([]); // Default to empty array to prevent map error
                if (responseData.message) {
                    setError(responseData.message); // Display message from backend if available
                } else {
                    setError('Received unexpected data format for reports.');
                }
            }
        } catch (err) {
            console.error('Failed to fetch reports:', err);
            setError(err.message || 'Failed to load reports. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleApplyFilters = () => {
        fetchReports(); // Re-fetch reports with current filters
    };

    const handleClearFilters = () => {
        setFilters({
            date_start: '',
            date_end: '',
            technicianId: '',
            reportId: '',
        });
        fetchReports();
    };

    // Render unauthorized message if not admin
    if (!isAdmin && !loading) {
        return (
            <div style={styles.container}>
                <div style={styles.unauthorizedMessage}>
                    <h2>Unauthorized Access</h2>
                    <p>You do not have permission to view reports.</p>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div style={styles.loading}>Loading reports...</div>;
    }

    if (error) {
        return <div style={styles.error}>Error: {error}</div>;
    }

    return (
        <div style={styles.container}>
            <DashboardNavbar/>
            <div style={styles.content}>
                <div style={styles.header}>
                    <h2 style={styles.h2}>Report Management</h2>
                </div>

                <div style={styles.filterContainer}>
                    <div style={styles.filterGroup}>
                        <label htmlFor="date_start" style={styles.label}>Start Date:</label>
                        <input
                            type="date"
                            id="date_start"
                            name="date_start"
                            value={filters.date_start}
                            onChange={handleFilterChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.filterGroup}>
                        <label htmlFor="date_end" style={styles.label}>End Date:</label>
                        <input
                            type="date"
                            id="date_end"
                            name="date_end"
                            value={filters.date_end}
                            onChange={handleFilterChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.filterGroup}>
                        <label htmlFor="technicianId" style={styles.label}>Technician ID:</label>
                        <input
                            type="text"
                            id="technicianId"
                            name="technicianId"
                            value={filters.technicianId}
                            onChange={handleFilterChange}
                            style={styles.input}
                            placeholder="e.g., UUID"
                        />
                    </div>
                    <div style={styles.filterGroup}>
                        <label htmlFor="reportId" style={styles.label}>Report ID:</label>
                        <input
                            type="text"
                            id="reportId"
                            name="reportId"
                            value={filters.reportId}
                            onChange={handleFilterChange}
                            style={styles.input}
                            placeholder="e.g., UUID"
                        />
                    </div>
                    <button style={styles.filterButton} onClick={handleApplyFilters}>
                        Apply Filters
                    </button>
                    <button style={styles.clearFiltersButton} onClick={handleClearFilters}>
                        Clear Filters
                    </button>
                </div>

                {reports.length === 0 ? (
                    <p style={styles.noReports}>No reports found matching the criteria.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>Report ID</th>
                            <th style={styles.th}>Technician ID</th>
                            <th style={styles.th}>Customer ID</th>
                            <th style={styles.th}>Service Request ID</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((report) => (
                            <tr key={report.id} >
                                <td style={styles.td}>{report.id}</td>
                                <td style={styles.td}>{report.technician.id}</td>
                                <td style={styles.td}>{report.serviceRequest.customer.id}</td>
                                <td style={styles.td}>{report.serviceRequest.id}</td>
                                <td style={styles.td}>{new Date(report.createdAt).toLocaleDateString()}</td>
                                <td style={styles.td}>{report.repairDetails}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewReports;