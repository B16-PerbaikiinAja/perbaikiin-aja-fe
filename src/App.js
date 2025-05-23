// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/context/AuthContext';

// Auth components
import Login from './auth/components/Login';
import RegisterCustomer from './auth/components/RegisterCustomer';
import RegisterTechnician from './auth/components/RegisterTechnician';
import Logout from './auth/components/Logout';

// Import components
import Dashboard from './components/Dashboard';
const NotFound = () => <div style={{textAlign: 'center', marginTop: '50px', fontFamily: 'Poppins, sans-serif'}}>404 - Page Not Found</div>;

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Import Poppins font
const AppStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      * {
        box-sizing: border-box;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
      }
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
          
          {/* Redirect from home to dashboard if logged in, otherwise to login */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;