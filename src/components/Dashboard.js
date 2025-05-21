// src/components/Dashboard.js
import React from 'react';
import { useAuth } from '../auth/context/AuthContext';
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
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
  },
};

const Dashboard = () => {
  const { user, isAdmin, isTechnician, isCustomer } = useAuth();

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
            <div 
              style={styles.card}
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
            </div>
            
            <div 
              style={styles.card}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>📊</div>
              <h3 style={styles.cardTitle}>View Reports</h3>
              <p style={styles.cardDescription}>
                Access service reports and track performance metrics.
              </p>
            </div>
            
            <div 
              style={styles.card}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>🎟️</div>
              <h3 style={styles.cardTitle}>Manage Coupons</h3>
              <p style={styles.cardDescription}>
                Create and manage discount coupons for your customers.
              </p>
            </div>
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
            <div 
              style={styles.card}
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
            </div>
            
            <div 
              style={styles.card}
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
            </div>
            
            <div 
              style={styles.card}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>💰</div>
              <h3 style={styles.cardTitle}>Earnings</h3>
              <p style={styles.cardDescription}>
                Track your completed jobs and total earnings.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // Customer dashboard
      return (
        <div>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Customer Dashboard</h1>
            <p style={styles.welcomeMessage}>
              Welcome to PerbaikiinAja! Request services and track your repair orders.
            </p>
          </div>
          
          <div style={styles.cardsContainer}>
            <div 
              style={styles.card}
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
                Submit a new repair request for your device or item.
              </p>
            </div>
            
            <div 
              style={styles.card}
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
                View and track the status of your repair orders.
              </p>
            </div>
            
            <div 
              style={styles.card}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div style={styles.cardIcon}>⭐</div>
              <h3 style={styles.cardTitle}>Reviews</h3>
              <p style={styles.cardDescription}>
                Leave reviews for technicians who have completed your repairs.
              </p>
            </div>
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