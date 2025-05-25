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
    background: 'linear-gradient(135deg, #4A90E2, #50E3C2)', // Light mode friendly gradient
    padding: '40px',
    borderRadius: '12px',
    color: 'white',
    marginBottom: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  welcomeTitle: {
    fontSize: '30px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  welcomeMessage: {
    fontSize: '16px',
    opacity: '0.9',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Adjusted minmax for potentially smaller cards
    gap: '25px',
    marginTop: '30px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: '25px',
    transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
    textAlign: 'left',
    width: '100%',
    fontFamily: 'Poppins, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Ensure content is spaced out
    minHeight: '180px', // Give cards a consistent minimum height
  },
  cardHover: {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
  },
  cardIcon: {
    fontSize: '32px', // Slightly smaller for a cleaner look
    marginBottom: '15px',
    color: '#4A90E2', // Maintained blue for icons
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#e9f3fe', // Light blue background for icon
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#555', // Slightly darker for better readability
    lineHeight: '1.6',
    flexGrow: 1, // Allow description to take available space
  },
  disabledCard: {
    backgroundColor: '#f9f9f9', // Lighter disabled background
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  disabledCardHover: {
    transform: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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

  // Card component to reduce repetition
  const ActionCard = ({ title, description, icon, path, isDisabled = false }) => {
    const currentStyle = isDisabled
      ? {...styles.card, ...styles.disabledCard}
      : styles.card;

    const hoverStyle = isDisabled
      ? styles.disabledCardHover
      : styles.cardHover;

    return (
      <button
        style={currentStyle}
        onClick={() => handleCardClick(isDisabled ? null : path)}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = hoverStyle.transform;
          e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = styles.card.boxShadow;
        }}
        disabled={isDisabled}
      >
        <div>
          <div style={styles.cardIcon}>{icon}</div>
          <h3 style={styles.cardTitle}>{title}</h3>
        </div>
        <p style={styles.cardDescription}>{description}</p>
      </button>
    );
  };


  const getRoleSpecificContent = () => {
    if (isAdmin) {
      return (
        <div>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Admin Dashboard</h1>
            <p style={styles.welcomeMessage}>
              Welcome, {user?.name || 'Admin'}! Manage technicians, view reports, and oversee the platform.
            </p>
          </div>

          <div style={styles.cardsContainer}>
            <ActionCard
              title="Manage Technicians"
              description="Register and manage technician accounts for your service team."
              icon="👨‍🔧"
              path="/admin/register-technician"
            />
            <ActionCard
              title="View All Reviews"
              description="Oversee and manage all user reviews on the platform."
              icon="⭐" // Changed icon
              path="/reviews" // Link to ReviewList
            />
            <ActionCard
              title="View Reports"
              description="Access service reports and track performance metrics. (Coming Soon)"
              icon="📊"
              isDisabled={true}
            />
            <ActionCard
              title="Manage Coupons"
              description="Create and manage discount coupons for your customers. "
              icon="🎟️"
              path="/admin/coupons"
            />
          </div>
        </div>
      );
    } else if (isTechnician) {
      return (
        <div>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Technician Dashboard</h1>
            <p style={styles.welcomeMessage}>
              Welcome back, {user?.name || 'Technician'}! Manage your service requests and track your performance.
            </p>
          </div>

          <div style={styles.cardsContainer}>
            <ActionCard
              title="Service Requests"
              description="View and manage incoming service requests from customers."
              icon="🔧"
              path="/technician/service-requests"
            />
            <ActionCard
              title="Create Reports"
              description="Submit reports for completed service requests (via Service Requests page)."
              icon="📝"
              path="/technician/service-requests" // Technicians create reports from the service request details
            />
            <ActionCard
              title="View Reviews"
              description="See reviews submitted by customers."
              icon="💬" // Changed icon
              path="/reviews" // Link to ReviewList
            />
            <ActionCard
              title="Earnings"
              description="Track your completed jobs and total earnings. (Coming Soon)"
              icon="💰"
              isDisabled={true}
            />
          </div>
        </div>
      );
    } else if (isCustomer) { // Assuming if not admin or technician, they are customer
      return (
        <div>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Customer Dashboard</h1>
            <p style={styles.welcomeMessage}>
              Welcome to PerbaikiinAja, {user?.name || 'Customer'}! Request services and manage your repairs.
            </p>
          </div>

          <div style={styles.cardsContainer}>
            <ActionCard
              title="Request & Manage Repairs"
              description="Submit new repair requests and manage your existing service orders."
              icon="📱"
              path="/customer/service-requests" // Links to Feature 2 (CustomerServiceRequests)
            />
            <ActionCard
              title="View & Write Reviews" // Updated title
              description="Read reviews and share your feedback for completed services." // Updated description
              icon="⭐"
              path="/reviews" // Updated path
            />
          </div>
        </div>
      );
    } else {
        // Fallback for users with no specific role or if role logic needs adjustment
        return (
             <div style={styles.welcomeSection}>
                <h1 style={styles.welcomeTitle}>Welcome, {user?.name || 'User'}!</h1>
                <p style={styles.welcomeMessage}>Your dashboard is being set up. Please check back later or contact support if you believe this is an error.</p>
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
