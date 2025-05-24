// src/components/Dashboard.js
import React from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';

const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
  },
  content: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcomeSection: {
    background: 'linear-gradient(135deg, #4285f4, #34a853)',
    padding: '40px',
    borderRadius: '8px',
    color: 'white',
    marginBottom: '30px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  welcomeMessage: {
    fontSize: '16px',
    opacity: '0.9',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    padding: '25px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    border: 'none',
    textAlign: 'left',
    width: '100%',
    fontFamily: 'Poppins, sans-serif',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  cardIcon: {
    fontSize: '36px',
    marginBottom: '15px',
    color: '#4285f4',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
  },
  // For non-implemented features
  disabledCard: {
    backgroundColor: '#f8f9fa',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  disabledCardHover: {
    transform: 'none',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
};

const Dashboard = () => {
  const { user, isAdmin, isTechnician, isCustomer } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
    } else {
      alert('This feature is coming soon!');
    }
  };

  // Different content based on user role
  const getRoleSpecificContent = () => {
    if (isAdmin) {
      return (
        <div>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Admin Dashboard</h1>
            <p style={styles.welcomeMessage}>
              Welcome to the administrator dashboard. Here you can manage technicians, view reports, and more.
            </p>
          </div>
          
          <div style={styles.cardsContainer}>
            {/* Manage Technicians - Implemented */}
            <button 
              style={styles.card}
              onClick={() => handleCardClick('/admin/register-technician')}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>👨‍🔧</div>
              <h3 style={styles.cardTitle}>Manage Technicians</h3>
              <p style={styles.cardDescription}>
                Register and manage technician accounts for your service team.
              </p>
            </button>
            
            {/* View Reports - Not implemented yet */}
            <button 
              style={{...styles.card, ...styles.disabledCard}}
              onClick={() => handleCardClick(null)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.disabledCardHover.transform;
                e.currentTarget.style.boxShadow = styles.disabledCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>📊</div>
              <h3 style={styles.cardTitle}>View Reports</h3>
              <p style={styles.cardDescription}>
                Access service reports and track performance metrics. (Coming Soon)
              </p>
            </button>
            
            {/* Manage Coupons - Not implemented yet */}
            <button 
              style={{...styles.card, ...styles.disabledCard}}
              onClick={() => handleCardClick(null)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.disabledCardHover.transform;
                e.currentTarget.style.boxShadow = styles.disabledCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>🎟️</div>
              <h3 style={styles.cardTitle}>Manage Coupons</h3>
              <p style={styles.cardDescription}>
                Create and manage discount coupons for your customers. (Coming Soon)
              </p>
            </button>
          </div>
        </div>
      );
    } else if (isTechnician) {
      return (
        <div>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Technician Dashboard</h1>
            <p style={styles.welcomeMessage}>
              Welcome to your technician dashboard. Manage your service requests and track your earnings.
            </p>
          </div>
          
          <div style={styles.cardsContainer}>
            {/* Service Requests - Implemented */}
            <button 
              style={styles.card}
              onClick={() => handleCardClick('/technician/service-requests')}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>🔧</div>
              <h3 style={styles.cardTitle}>Service Requests</h3>
              <p style={styles.cardDescription}>
                View and manage incoming service requests from customers.
              </p>
            </button>
            
            {/* Create Reports - Accessible from Service Requests page */}
            <button 
              style={styles.card}
              onClick={() => handleCardClick('/technician/service-requests')}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>📝</div>
              <h3 style={styles.cardTitle}>Create Reports</h3>
              <p style={styles.cardDescription}>
                Submit reports for completed service requests.
              </p>
            </button>
            
            {/* Earnings - Not implemented yet */}
            <button 
              style={{...styles.card, ...styles.disabledCard}}
              onClick={() => handleCardClick(null)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.disabledCardHover.transform;
                e.currentTarget.style.boxShadow = styles.disabledCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>💰</div>
              <h3 style={styles.cardTitle}>Earnings</h3>
              <p style={styles.cardDescription}>
                Track your completed jobs and total earnings. (Coming Soon)
              </p>
            </button>
          </div>
        </div>
      );
    } else {
      // Customer dashboard with Feature 2 implemented
      return (
        <div>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Customer Dashboard</h1>
            <p style={styles.welcomeMessage}>
              Welcome to PerbaikiinAja! Request services and track your repair orders.
            </p>
          </div>
          
          <div style={styles.cardsContainer}>
            {/* Request Repair - Feature 2 implemented */}
            <button 
              style={styles.card}
              onClick={() => handleCardClick('/customer/service-requests')}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>📱</div>
              <h3 style={styles.cardTitle}>Request Repair</h3>
              <p style={styles.cardDescription}>
                Submit a new repair request for your device or item and manage existing requests.
              </p>
            </button>
            
            {/* Track Orders - Feature 2 implemented */}
            <button 
              style={styles.card}
              onClick={() => handleCardClick('/customer/service-requests')}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>🔍</div>
              <h3 style={styles.cardTitle}>Track Orders</h3>
              <p style={styles.cardDescription}>
                View and track the status of your repair orders and service history.
              </p>
            </button>
            
            {/* Service History - Alternative view using Feature 3 */}
            <button 
              style={styles.card}
              onClick={() => handleCardClick('/customer/requests-tracker')}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>📋</div>
              <h3 style={styles.cardTitle}>Service History</h3>
              <p style={styles.cardDescription}>
                View detailed service history and respond to estimates from technicians.
              </p>
            </button>

            {/* Reviews - Not implemented yet */}
            <button 
              style={{...styles.card, ...styles.disabledCard}}
              onClick={() => handleCardClick(null)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.disabledCardHover.transform;
                e.currentTarget.style.boxShadow = styles.disabledCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>⭐</div>
              <h3 style={styles.cardTitle}>Reviews</h3>
              <p style={styles.cardDescription}>
                Leave reviews for technicians who have completed your repairs. (Coming Soon)
              </p>
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={styles.container}>
      <DashboardNavbar />
      <div style={styles.content}>
        {getRoleSpecificContent()}
      </div>
    </div>
  );
};

export default Dashboard;