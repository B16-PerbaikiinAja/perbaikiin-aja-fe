// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/context/AuthContext';

// Auth components
import Login from './auth/components/Login';
import RegisterCustomer from './auth/components/RegisterCustomer';
import RegisterTechnician from './auth/components/RegisterTechnician';
import Logout from './auth/components/Logout';

// Review components
import ReviewList from './feature-4/components/ReviewList';
import CreateReview from './feature-4/components/CreateReview';
import EditReview from './feature-4/components/EditReview';

// General components
import Dashboard from './components/Dashboard';

// Service requests features
import { TechnicianServiceRequests, CustomerServiceRequests as Feature3CustomerServiceRequests } from './feature-3';
import { CustomerServiceRequests } from './feature-2';
import { PaymentMethodList } from './feature-6';

// Import coupon management feature
import { AdminCouponManagement } from './feature-5';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Poppins, sans-serif' }}>
    404 - Page Not Found
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

// Technician route component
const TechnicianRoute = ({ children }) => {
  const { isTechnician, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isTechnician) return <Navigate to="/dashboard" />;
  return children;
};

// Customer route component
const CustomerRoute = ({ children }) => {
  const { isCustomer, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isCustomer) return <Navigate to="/dashboard" />;
  return children;
};

// Import Poppins font
const AppStyles = () => (
    <style>
      {`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
    `}
    </style>
);

function App() {
  return (
    <AuthProvider>
      <AppStyles />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterCustomer />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/register-technician" element={
            <AdminRoute>
              <RegisterTechnician />
            </AdminRoute>
          } />

          {/* Admin routes - Feature 6 Implementation */}
          <Route path="/admin/payment-methods" element={
              <AdminRoute>
                  <PaymentMethodList />
              </AdminRoute>
          } />

          {/* Admin routes - Coupon Management Implementation */}
          <Route path="/admin/coupons" element={
              <AdminRoute>
                  <AdminCouponManagement />
              </AdminRoute>
          } />

          {/* Technician routes */}
          <Route path="/technician/service-requests" element={
            <TechnicianRoute>
              <TechnicianServiceRequests />
            </TechnicianRoute>
          } />

          {/* Customer routes - Feature 2 */}
          <Route path="/customer/service-requests" element={
            <CustomerRoute>
              <CustomerServiceRequests />
            </CustomerRoute>
          } />

          {/* Customer routes - Feature 3 (alternative view) */}
          <Route path="/customer/requests-tracker" element={
            <CustomerRoute>
              <Feature3CustomerServiceRequests />
            </CustomerRoute>
          } />

          {/* Feature 4: Review Routes */}
          <Route path="/reviews" element={
            <ProtectedRoute>
              <ReviewList />
            </ProtectedRoute>
          } />
          <Route path="/reviews/create" element={
            <ProtectedRoute>
              <CreateReview />
            </ProtectedRoute>
          } />
          <Route path="/reviews/edit/:id" element={
            <ProtectedRoute>
              <EditReview />
            </ProtectedRoute>
          } />

          {/* Redirect from home */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
