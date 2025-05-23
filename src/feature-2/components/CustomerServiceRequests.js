// src/feature-2/components/CustomerServiceRequests.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import DashboardNavbar from '../../components/DashboardNavbar';
import CreateServiceRequestForm from './CreateServiceRequestForm';
import EditServiceRequestForm from './EditServiceRequestForm';
import ServiceRequestCard from './ServiceRequestCard';
import customerServiceRequestService from '../services/serviceRequestService';
import authService from '../../auth/services/authService';
import { SERVICE_REQUEST_STATUS, STATUS_LABELS } from '../utils/constants';

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
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s',
  },
  createButton: {
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
  warningNotification: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeaa7',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '20px',
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
      const requests = await customerServiceRequestService.getCustomerServiceRequests(token);
      
      if (Array.isArray(requests)) {
        setServiceRequests(requests);
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

  const handleCreateSuccess = (newRequest) => {
    setShowCreateForm(false);
    fetchServiceRequests(); // Refresh the list
    showNotification('success', 'Service request created successfully!');
  };

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setShowEditForm(true);
  };

  const handleEditSuccess = (updatedRequest) => {
    setShowEditForm(false);
    setSelectedRequest(null);
    fetchServiceRequests(); // Refresh the list
    showNotification('success', 'Service request updated successfully!');
  };

  const handleDeleteRequest = async (request) => {
    try {
      const token = authService.getToken();
      await customerServiceRequestService.deleteServiceRequest(request.id, token);
      
      fetchServiceRequests(); // Refresh the list
      showNotification('success', 'Service request deleted successfully!');
    } catch (error) {
      showNotification('error', error.message || 'Failed to delete service request');
    }
  };

  const getStats = () => {
    const stats = {
      total: serviceRequests.length,
      pending: serviceRequests.filter(r => (r.stateType || r.status) === SERVICE_REQUEST_STATUS.PENDING).length,
      estimated: serviceRequests.filter(r => (r.stateType || r.status) === SERVICE_REQUEST_STATUS.ESTIMATED).length,
      inProgress: serviceRequests.filter(r => (r.stateType || r.status) === SERVICE_REQUEST_STATUS.IN_PROGRESS).length,
      completed: serviceRequests.filter(r => (r.stateType || r.status) === SERVICE_REQUEST_STATUS.COMPLETED).length,
    };
    return stats;
  };

  const stats = getStats();

  // If showing create form
  if (showCreateForm) {
    return (
      <div style={styles.container}>
        <DashboardNavbar />
        <div style={styles.content}>
          <button
            onClick={() => setShowCreateForm(false)}
            style={styles.backButton}
          >
            ← Back to My Requests
          </button>
          <CreateServiceRequestForm
            onCancel={() => setShowCreateForm(false)}
            onSuccess={handleCreateSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <DashboardNavbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Service Requests</h1>
          
          <div style={styles.headerActions}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Status</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <button
              onClick={fetchServiceRequests}
              style={styles.refreshButton}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button
              onClick={() => setShowCreateForm(true)}
              style={styles.createButton}
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
            <div style={styles.statNumber}>{stats.pending}</div>
            <div style={styles.statLabel}>Pending</div>
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
        {stats.estimated > 0 && (
          <div style={{...styles.notification, ...styles.warningNotification}}>
            <strong>Action Required:</strong> You have {stats.estimated} estimate{stats.estimated > 1 ? 's' : ''} awaiting your response. 
            Check your notifications for details.
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

        {/* Loading State */}
        {loading && !error && (
          <div style={styles.loadingContainer}>
            Loading your service requests...
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div style={styles.contentContainer}>
            {filteredRequests.length === 0 ? (
              <div style={styles.emptyContainer}>
                <div style={styles.emptyIcon}>📱</div>
                <div style={styles.emptyTitle}>
                  {statusFilter ? `No ${STATUS_LABELS[statusFilter].toLowerCase()} requests` : 'No service requests'}
                </div>
                <div style={styles.emptyMessage}>
                  {statusFilter 
                    ? `You don't have any ${STATUS_LABELS[statusFilter].toLowerCase()} service requests at the moment.`
                    : 'You haven\'t created any service requests yet. Create your first request to get started!'
                  }
                </div>
                {!statusFilter && (
                  <button
                    style={styles.createButton}
                    onClick={() => setShowCreateForm(true)}
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
                  onEdit={handleEditRequest}
                  onDelete={handleDeleteRequest}
                  showActions={true}
                />
              ))
            )}
          </div>
        )}

        {/* Edit Modal */}
        {showEditForm && selectedRequest && (
          <EditServiceRequestForm
            serviceRequest={selectedRequest}
            onCancel={() => {
              setShowEditForm(false);
              setSelectedRequest(null);
            }}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerServiceRequests;