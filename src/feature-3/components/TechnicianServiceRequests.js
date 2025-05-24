// src/feature-3/components/TechnicianServiceRequests.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import ServiceRequestCard from './ServiceRequestCard';
import EstimateForm from './EstimateForm';
import ReportForm from './ReportForm';
import serviceRequestService from '../services/serviceRequestService';
import estimateService from '../services/estimateService';
import reportService from '../services/reportService';
import authService from '../../auth/services/authService';

const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
  },
  filters: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#4285f4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#4285f4',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  contentContainer: {
    minHeight: '400px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    fontSize: '16px',
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '50px',
    color: '#666',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  emptyMessage: {
    fontSize: '14px',
  },
  notification: {
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
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

const TechnicianServiceRequests = () => {
  const { user } = useAuth();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // Modal states
  const [showEstimateForm, setShowEstimateForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [serviceRequests, statusFilter]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching service requests for technician:', user.id);
      const token = authService.getToken();
      const response = await serviceRequestService.getTechnicianServiceRequests(
        user.id,
        null,
        token
      );
      
      if (response && response.serviceRequests) {
        setServiceRequests(response.serviceRequests);
      } else {
        setServiceRequests([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch service requests');
      setServiceRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = serviceRequests;
    
    if (statusFilter) {
      filtered = filtered.filter(request => 
        (request.stateType || request.status) === statusFilter
      );
    }
    
    setFilteredRequests(filtered);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleProvideEstimate = (serviceRequest) => {
    setSelectedRequest(serviceRequest);
    setShowEstimateForm(true);
  };

  const handleSubmitEstimate = async (estimateData) => {
    try {
      setFormLoading(true);
      const token = authService.getToken();
      
      await estimateService.createEstimate(
        selectedRequest.id,
        estimateData,
        token
      );
      
      setShowEstimateForm(false);
      setSelectedRequest(null);
      showNotification('success', 'Estimate submitted successfully!');
      fetchServiceRequests(); // Refresh the list
    } catch (err) {
      showNotification('error', err.message || 'Failed to submit estimate');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (serviceRequest, newStatus) => {
    try {
      const token = authService.getToken();
      let finalPrice = null;
      
      // If completing the service, ask for final price
      if (newStatus === 'COMPLETED') {
        const price = prompt('Enter the final price for this service:');
        if (price === null) return; // User cancelled
        
        finalPrice = parseFloat(price);
        if (isNaN(finalPrice) || finalPrice <= 0) {
          showNotification('error', 'Please enter a valid final price');
          return;
        }
      }
      
      await serviceRequestService.updateServiceRequestStatus(
        serviceRequest.id,
        newStatus,
        finalPrice,
        token
      );
      
      showNotification('success', `Service request status updated to ${newStatus}!`);
      fetchServiceRequests(); // Refresh the list
    } catch (err) {
      showNotification('error', err.message || 'Failed to update status');
    }
  };

  const handleCreateReport = (serviceRequest) => {
    setSelectedRequest(serviceRequest);
    setShowReportForm(true);
  };

  const handleSubmitReport = async (reportData) => {
    try {
      setFormLoading(true);
      const token = authService.getToken();
      
      await reportService.createReport(reportData, token);
      
      setShowReportForm(false);
      setSelectedRequest(null);
      showNotification('success', 'Report created successfully!');
      fetchServiceRequests(); // Refresh the list
    } catch (err) {
      showNotification('error', err.message || 'Failed to create report');
    } finally {
      setFormLoading(false);
    }
  };

  const getStats = () => {
    const stats = {
      total: serviceRequests.length,
      pending: serviceRequests.filter(r => (r.stateType || r.status) === 'PENDING').length,
      inProgress: serviceRequests.filter(r => (r.stateType || r.status) === 'IN_PROGRESS').length,
      completed: serviceRequests.filter(r => (r.stateType || r.status) === 'COMPLETED').length,
    };
    return stats;
  };

  const stats = getStats();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          Loading service requests...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Service Requests</h1>
        
        <div style={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ESTIMATED">Estimated</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          
          <button
            onClick={fetchServiceRequests}
            style={styles.refreshButton}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Requests</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.inProgress}</div>
          <div style={styles.statLabel}>In Progress</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.completed}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
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

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          {error}
        </div>
      )}

      {/* Content */}
      <div style={styles.contentContainer}>
        {filteredRequests.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>📋</div>
            <div style={styles.emptyTitle}>
              {statusFilter ? `No ${statusFilter.toLowerCase()} requests` : 'No service requests'}
            </div>
            <div style={styles.emptyMessage}>
              {statusFilter 
                ? `You don't have any ${statusFilter.toLowerCase()} service requests at the moment.`
                : 'You don\'t have any service requests assigned to you yet.'
              }
            </div>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <ServiceRequestCard
              key={request.id}
              serviceRequest={request}
              userRole="TECHNICIAN"
              onProvideEstimate={handleProvideEstimate}
              onUpdateStatus={handleUpdateStatus}
              onCreateReport={handleCreateReport}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showEstimateForm && selectedRequest && (
        <EstimateForm
          serviceRequest={selectedRequest}
          onSubmit={handleSubmitEstimate}
          onCancel={() => {
            setShowEstimateForm(false);
            setSelectedRequest(null);
          }}
          isLoading={formLoading}
        />
      )}

      {showReportForm && selectedRequest && (
        <ReportForm
          serviceRequest={selectedRequest}
          onSubmit={handleSubmitReport}
          onCancel={() => {
            setShowReportForm(false);
            setSelectedRequest(null);
          }}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

export default TechnicianServiceRequests;