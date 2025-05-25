// src/feature-3/components/CustomerServiceRequests.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import ServiceRequestCard from './ServiceRequestCard';
import EstimateResponseForm from './EstimateResponseForm';
import serviceRequestService from '../services/serviceRequestService';
import estimateService from '../services/estimateService';
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
  newRequestButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
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
    marginBottom: '20px',
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
  estimateAlert: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #bee5eb',
  },
  alertIcon: {
    marginRight: '8px',
    fontWeight: 'bold',
  },
};

const CustomerServiceRequests = () => {
  const { user } = useAuth();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // Modal states
  const [showEstimateResponseForm, setShowEstimateResponseForm] = useState(false);
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
      
      const token = authService.getToken();
      const response = await serviceRequestService.getCustomerServiceRequests(
        user.id,
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

  const handleRespondToEstimate = (serviceRequest, action) => {
    if (action === 'ACCEPT' || action === 'REJECT') {
      setSelectedRequest(serviceRequest);
      setShowEstimateResponseForm(true);
    }
  };

  const handleSubmitEstimateResponse = async (action, feedback) => {
    try {
      setFormLoading(true);
      const token = authService.getToken();
      
      await estimateService.respondToEstimate(
        selectedRequest.estimate.id,
        action,
        feedback,
        token
      );
      
      setShowEstimateResponseForm(false);
      setSelectedRequest(null);
      
      if (action === 'ACCEPT') {
        showNotification('success', 'Estimate accepted! The technician will start working on your item.');
      } else {
        showNotification('success', 'Estimate rejected. The service request has been cancelled.');
      }
      
      fetchServiceRequests(); // Refresh the list
    } catch (err) {
      showNotification('error', err.message || 'Failed to respond to estimate');
    } finally {
      setFormLoading(false);
    }
  };

  const getStats = () => {
    const stats = {
      total: serviceRequests.length,
      pending: serviceRequests.filter(r => (r.stateType || r.status) === 'PENDING').length,
      estimated: serviceRequests.filter(r => (r.stateType || r.status) === 'ESTIMATED').length,
      inProgress: serviceRequests.filter(r => (r.stateType || r.status) === 'IN_PROGRESS').length,
      completed: serviceRequests.filter(r => (r.stateType || r.status) === 'COMPLETED').length,
    };
    return stats;
  };

  const getPendingEstimates = () => {
    return serviceRequests.filter(r => (r.stateType || r.status) === 'ESTIMATED');
  };

  const stats = getStats();
  const pendingEstimates = getPendingEstimates();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          Loading your service requests...
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
            <option value="ESTIMATED">Awaiting Response</option>
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
          
          <button
            style={styles.newRequestButton}
            onClick={() => {
              // TODO: Navigate to create new service request
              alert('New service request feature will be implemented in the next phase');
            }}
          >
            + New Request
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
          <div style={styles.statNumber}>{stats.estimated}</div>
          <div style={styles.statLabel}>Awaiting Response</div>
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

      {/* Pending Estimates Alert */}
      {pendingEstimates.length > 0 && (
        <div style={styles.estimateAlert}>
          <span style={styles.alertIcon}>💬</span>
          <strong>Action Required:</strong> You have {pendingEstimates.length} estimate{pendingEstimates.length > 1 ? 's' : ''} awaiting your response.
        </div>
      )}

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
            <div style={styles.emptyIcon}>📱</div>
            <div style={styles.emptyTitle}>
              {statusFilter ? `No ${statusFilter.toLowerCase()} requests` : 'No service requests'}
            </div>
            <div style={styles.emptyMessage}>
              {statusFilter 
                ? `You don't have any ${statusFilter.toLowerCase()} service requests at the moment.`
                : 'You haven\'t created any service requests yet.'
              }
            </div>
            {!statusFilter && (
              <button
                style={styles.newRequestButton}
                onClick={() => {
                  // TODO: Navigate to create new service request
                  alert('New service request feature will be implemented in the next phase');
                }}
              >
                Create Your First Request
              </button>
            )}
          </div>
        ) : (
          filteredRequests.map((request) => (
            <ServiceRequestCard
              key={request.id}
              serviceRequest={request}
              userRole="CUSTOMER"
              onRespondToEstimate={handleRespondToEstimate}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showEstimateResponseForm && selectedRequest && (
        <EstimateResponseForm
          serviceRequest={selectedRequest}
          onSubmit={handleSubmitEstimateResponse}
          onCancel={() => {
            setShowEstimateResponseForm(false);
            setSelectedRequest(null);
          }}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

export default CustomerServiceRequests;